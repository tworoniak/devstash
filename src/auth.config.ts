import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

export default {
  pages: {
    signIn: '/sign-in',
  },
  providers: [GitHub],
} satisfies NextAuthConfig;
