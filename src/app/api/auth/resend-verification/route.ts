import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, retryAfterSeconds } from '@/lib/rate-limit';
import { ResendVerificationSchema } from '@/lib/schemas/auth';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    const parsed = ResendVerificationSchema.safeParse(await request.json());
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { email } = parsed.data;

    // Key by IP + email to allow multiple users from same IP (e.g. office)
    // while still limiting per-account abuse
    const rl = await checkRateLimit('resendVerification', `${ip}:${email}`);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${retryAfterSeconds(rl.reset)} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds(rl.reset)) } }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Don't reveal whether the email exists
    if (!user) {
      return NextResponse.json({ success: true });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Delete any existing token for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
