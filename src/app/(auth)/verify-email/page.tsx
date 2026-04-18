'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

type Status = 'verifying' | 'success' | 'error' | 'resend';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'resend');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error ?? 'Verification failed');
      }
    }

    verify();
  }, [token]);

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResendError('');
    setResendLoading(true);

    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setResendLoading(false);

    if (res.ok) {
      setResendSent(true);
    } else {
      setResendError(data.error ?? 'Failed to resend email');
    }
  }

  if (status === 'verifying') {
    return (
      <div className='text-center space-y-3'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto text-muted-foreground' />
        <p className='text-muted-foreground'>Verifying your email…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className='w-full max-w-sm text-center space-y-4'>
        <CheckCircle className='h-12 w-12 text-emerald-500 mx-auto' />
        <h1 className='text-2xl font-semibold'>Email verified!</h1>
        <p className='text-muted-foreground'>Your account is now active. You can sign in.</p>
        <Button className='w-full' onClick={() => router.push('/sign-in')}>
          Sign in
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='w-full max-w-sm text-center space-y-4'>
        <XCircle className='h-12 w-12 text-destructive mx-auto' />
        <h1 className='text-2xl font-semibold'>Verification failed</h1>
        <p className='text-muted-foreground text-sm'>{errorMessage}</p>
        <Button variant='outline' className='w-full' onClick={() => setStatus('resend')}>
          Resend verification email
        </Button>
        <Link href='/sign-in' className='block text-sm text-muted-foreground hover:text-foreground'>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full max-w-sm space-y-6'>
      <div className='text-center space-y-2'>
        <Mail className='h-10 w-10 text-muted-foreground mx-auto' />
        <h1 className='text-2xl font-semibold'>Check your email</h1>
        <p className='text-sm text-muted-foreground'>
          We sent a verification link to your email address. Click it to activate your account.
        </p>
      </div>

      {resendSent ? (
        <p className='text-center text-sm text-emerald-500'>Verification email sent! Check your inbox.</p>
      ) : (
        <form onSubmit={handleResend} className='space-y-4'>
          <Input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {resendError && <p className='text-sm text-destructive'>{resendError}</p>}
          <Button type='submit' variant='outline' className='w-full' disabled={resendLoading}>
            {resendLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Resend verification email
          </Button>
        </form>
      )}

      <p className='text-center text-sm text-muted-foreground'>
        Already verified?{' '}
        <Link href='/sign-in' className='text-foreground underline underline-offset-4 hover:text-primary'>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4'>
      <Suspense fallback={
        <div className='text-center space-y-3'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto text-muted-foreground' />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
