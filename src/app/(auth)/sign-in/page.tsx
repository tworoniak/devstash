'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
    }
  }

  async function handleGitHub() {
    setGithubLoading(true);
    await signIn('github', { callbackUrl: '/dashboard' });
  }

  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='text-center space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
          <p className='text-sm text-muted-foreground'>Sign in to your DevStash account</p>
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

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
              <Link href='/forgot-password' className='text-xs text-muted-foreground hover:text-foreground underline underline-offset-4'>
                Forgot password?
              </Link>
            </div>
            <Input
              id='password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
          </div>

          {error && (
            <div className='space-y-1'>
              <p className='text-sm text-destructive'>{error}</p>
              <p className='text-xs text-muted-foreground'>
                Recently registered?{' '}
                <Link href='/verify-email' className='underline underline-offset-4 hover:text-foreground'>
                  Verify your email
                </Link>
              </p>
            </div>
          )}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign in
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-border' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>or</span>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full gap-2'
          onClick={handleGitHub}
          disabled={githubLoading}
        >
          {githubLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
          </svg>
          )}
          Sign in with GitHub
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='text-foreground underline underline-offset-4 hover:text-primary'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
