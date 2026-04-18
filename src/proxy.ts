import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/profile');

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/profile'],
};
