import { StatsSection } from '@/components/dashboard/stats-section';
import { CollectionsSection } from '@/components/dashboard/collections-section';
import { PinnedSection } from '@/components/dashboard/pinned-section';
import { RecentSection } from '@/components/dashboard/recent-section';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <StatsSection />
      <CollectionsSection />
      <PinnedSection />
      <RecentSection />
    </div>
  );
}
