'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to change password');
        return;
      }

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label htmlFor='current-password'>Current Password</Label>
        <Input
          id='current-password'
          type='password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete='current-password'
        />
      </div>
      <div className='space-y-1.5'>
        <Label htmlFor='new-password'>New Password</Label>
        <Input
          id='new-password'
          type='password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete='new-password'
          minLength={8}
        />
      </div>
      <div className='space-y-1.5'>
        <Label htmlFor='confirm-password'>Confirm New Password</Label>
        <Input
          id='confirm-password'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete='new-password'
          minLength={8}
        />
      </div>
      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}
