import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'DevStash <onboarding@resend.dev>';
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your DevStash password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0a0a0a;color:#e5e5e5;border-radius:8px">
        <h2 style="margin-top:0;color:#ffffff">Reset your password</h2>
        <p>Click the button below to reset your DevStash password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Reset password
        </a>
        <p style="color:#737373;font-size:14px">If you didn't request a password reset, you can ignore this email. Your password won't change.</p>
        <p style="color:#525252;font-size:12px">Or copy this link: ${url}</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your DevStash email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0a0a0a;color:#e5e5e5;border-radius:8px">
        <h2 style="margin-top:0;color:#ffffff">Verify your email</h2>
        <p>Click the button below to verify your email address and activate your DevStash account.</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Verify email
        </a>
        <p style="color:#737373;font-size:14px">This link expires in 24 hours. If you didn't create a DevStash account, you can ignore this email.</p>
        <p style="color:#525252;font-size:12px">Or copy this link: ${url}</p>
      </div>
    `,
  });
}
