import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, retryAfterSeconds } from '@/lib/rate-limit';
import { RegisterSchema } from '@/lib/schemas/auth';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit('register', ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${retryAfterSeconds(rl.reset)} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds(rl.reset)) } }
      );
    }

    const parsed = RegisterSchema.safeParse(await request.json());
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true';

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        emailVerified: skipVerification ? new Date() : null,
      },
    });

    if (!skipVerification) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      });

      try {
        await sendVerificationEmail(email, token);
      } catch {
        // User created and token stored — they can resend from /verify-email
      }
    }

    return NextResponse.json(
      { success: true, redirectTo: skipVerification ? '/sign-in' : '/verify-email' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
