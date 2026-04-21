import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/db/users';
import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { DeleteAccountDialog } from '@/components/profile/delete-account-dialog';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const profile = await getUserProfile(session.user.id);
  if (!profile) redirect('/sign-in');

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <h1 className='text-2xl font-semibold text-foreground'>Settings</h1>

      {/* Change Password — only for email/password users */}
      {profile.hasPassword && (
        <section className='bg-card border border-border rounded-lg p-6 space-y-4'>
          <h2 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
            Change Password
          </h2>
          <ChangePasswordForm />
        </section>
      )}

      {/* Danger Zone */}
      <section className='bg-card border border-destructive/30 rounded-lg p-6 space-y-4'>
        <h2 className='text-sm font-semibold text-destructive uppercase tracking-wide'>
          Danger Zone
        </h2>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-foreground'>Delete account</p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Permanently delete your account and all data.
            </p>
          </div>
          <DeleteAccountDialog />
        </div>
      </section>
    </div>
  );
}
