import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

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
