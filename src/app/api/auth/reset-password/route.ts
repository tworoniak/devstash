import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp, retryAfterSeconds } from '@/lib/rate-limit';
import { ResetPasswordSchema } from '@/lib/schemas/auth';

const IDENTIFIER_PREFIX = 'password-reset:';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit('resetPassword', ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${retryAfterSeconds(rl.reset)} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds(rl.reset)) } }
      );
    }

    const parsed = ResetPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { token, password } = parsed.data;

    const record = await prisma.verificationToken.findUnique({ where: { token } });

    if (!record || !record.identifier.startsWith(IDENTIFIER_PREFIX)) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: 'Reset link has expired' }, { status: 400 });
    }

    const email = record.identifier.slice(IDENTIFIER_PREFIX.length);
    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
