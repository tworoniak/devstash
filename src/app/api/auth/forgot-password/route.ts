import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const IDENTIFIER_PREFIX = 'password-reset:';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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
