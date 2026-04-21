import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { timeAgo } from '@/lib/utils';
import { StatsSection } from '@/components/dashboard/stats-section';
import { CollectionsSection } from '@/components/dashboard/collections-section';
import { PinnedSection } from '@/components/dashboard/pinned-section';
import { RecentSection } from '@/components/dashboard/recent-section';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there';

  let lastStashAt: Date | null = null;
  if (userId) {
    const latest = await prisma.item.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    lastStashAt = latest?.createdAt ?? null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        {lastStashAt && (
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off — last stash {timeAgo(lastStashAt)}
          </p>
        )}
      </div>
      <StatsSection />
      <CollectionsSection />
      <PinnedSection />
      <RecentSection />
    </div>
  );
}
