'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
    }
  }

  if (sent) {
    return (
      <div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4'>
        <div className='w-full max-w-sm text-center space-y-4'>
          <CheckCircle className='h-12 w-12 text-emerald-500 mx-auto' />
          <h1 className='text-2xl font-semibold'>Check your email</h1>
          <p className='text-sm text-muted-foreground'>
            If an account exists for <span className='text-foreground'>{email}</span>, we sent a
            password reset link. Check your inbox.
          </p>
          <Link href='/sign-in'>
            <Button variant='outline' className='w-full'>
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center space-y-2'>
          <Mail className='h-10 w-10 text-muted-foreground mx-auto' />
          <h1 className='text-2xl font-semibold tracking-tight'>Forgot your password?</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>

          {error && <p className='text-sm text-destructive'>{error}</p>}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Send reset link
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Remember your password?{' '}
          <Link href='/sign-in' className='text-foreground underline underline-offset-4 hover:text-primary'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
