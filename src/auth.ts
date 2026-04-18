import NextAuth, { CredentialsSignin } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import authConfig from './auth.config';

class RateLimitError extends CredentialsSignin {
  code = 'RATE_LIMITED';
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials, request) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) return null;

        const ip = getClientIp(request as Request);
        const rl = await checkRateLimit('login', `${ip}:${email}`);
        if (!rl.success) throw new RateLimitError();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true';
        if (!skipVerification && !user.emailVerified) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        return user;
      },
    }),
  ],
});
