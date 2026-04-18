'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className='w-full max-w-sm text-center space-y-4'>
        <XCircle className='h-12 w-12 text-destructive mx-auto' />
        <h1 className='text-2xl font-semibold'>Invalid reset link</h1>
        <p className='text-sm text-muted-foreground'>
          This password reset link is missing a token.
        </p>
        <Link href='/forgot-password'>
          <Button variant='outline' className='w-full'>
            Request a new link
          </Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className='w-full max-w-sm text-center space-y-4'>
        <CheckCircle className='h-12 w-12 text-emerald-500 mx-auto' />
        <h1 className='text-2xl font-semibold'>Password reset!</h1>
        <p className='text-sm text-muted-foreground'>
          Your password has been updated. You can now sign in.
        </p>
        <Button className='w-full' onClick={() => router.push('/sign-in')}>
          Sign in
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
    }
  }

  return (
    <div className='w-full max-w-sm space-y-6'>
      <div className='text-center space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Reset your password</h1>
        <p className='text-sm text-muted-foreground'>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='password'>New password</Label>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='new-password'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm new password</Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='••••••••'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete='new-password'
          />
        </div>

        {error && (
          <div className='space-y-1'>
            <p className='text-sm text-destructive'>{error}</p>
            {error.includes('expired') && (
              <p className='text-xs text-muted-foreground'>
                <Link href='/forgot-password' className='underline underline-offset-4 hover:text-foreground'>
                  Request a new reset link
                </Link>
              </p>
            )}
          </div>
        )}

        <Button type='submit' className='w-full' disabled={loading}>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Reset password
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        Remember your password?{' '}
        <Link href='/sign-in' className='text-foreground underline underline-offset-4 hover:text-primary'>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4'>
      <Suspense fallback={
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto text-muted-foreground' />
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
