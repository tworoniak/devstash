import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, retryAfterSeconds } from '@/lib/rate-limit';
import { ForgotPasswordSchema } from '@/lib/schemas/auth';

const IDENTIFIER_PREFIX = 'password-reset:';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit('forgotPassword', ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${retryAfterSeconds(rl.reset)} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds(rl.reset)) } }
      );
    }

    const parsed = ForgotPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Silent success — don't reveal whether email exists
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const identifier = `${IDENTIFIER_PREFIX}${email}`;

    // Delete any existing reset token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
