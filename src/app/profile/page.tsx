import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserProfile, getProfileStats } from '@/lib/db/users';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Code } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const [profile, stats] = await Promise.all([
    getUserProfile(session.user.id),
    getProfileStats(session.user.id),
  ]);

  if (!profile) redirect('/sign-in');

  const joinedDate = profile.createdAt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <h1 className='text-2xl font-semibold text-foreground'>Profile</h1>

      {/* User Info */}
      <section className='bg-card border border-border rounded-lg p-6'>
        <div className='flex items-center gap-4'>
          <UserAvatar name={profile.name} image={profile.image} size={56} />
          <div className='min-w-0'>
            <p className='text-lg font-medium text-foreground truncate'>
              {profile.name ?? 'No name'}
            </p>
            <p className='text-sm text-muted-foreground truncate'>{profile.email}</p>
            <p className='text-xs text-muted-foreground/70 mt-1'>Joined {joinedDate}</p>
          </div>
        </div>
      </section>

      {/* Usage Stats */}
      <section className='bg-card border border-border rounded-lg p-6 space-y-4'>
        <h2 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
          Usage
        </h2>

        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-background rounded-md p-3 border border-border'>
            <p className='text-2xl font-bold text-foreground'>{stats.totalItems}</p>
            <p className='text-xs text-muted-foreground mt-0.5'>Total Items</p>
          </div>
          <div className='bg-background rounded-md p-3 border border-border'>
            <p className='text-2xl font-bold text-foreground'>{stats.totalCollections}</p>
            <p className='text-xs text-muted-foreground mt-0.5'>Collections</p>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
            By Type
          </p>
          <div className='space-y-1'>
            {stats.itemTypeCounts.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? Code;
              return (
                <div
                  key={type.id}
                  className='flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/50 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <Icon className='h-3.5 w-3.5 shrink-0' style={{ color: type.color }} />
                    <span className='text-sm text-foreground capitalize'>{type.name}s</span>
                  </div>
                  <span className='text-sm font-medium text-muted-foreground'>{type.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
