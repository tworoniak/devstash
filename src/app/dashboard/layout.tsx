import { prisma } from '@/lib/prisma';
import { getSidebarItemTypes } from '@/lib/db/items';
import { getSidebarFavoriteCollections, getSidebarRecentCollections } from '@/lib/db/collections';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import type { SidebarData } from '@/components/layout/sidebar';

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  return user?.id ?? null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let sidebarData: SidebarData | null = null;

  try {
    const userId = await getDemoUserId();
    if (userId) {
      const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
        getSidebarItemTypes(userId),
        getSidebarFavoriteCollections(userId),
        getSidebarRecentCollections(userId),
      ]);
      sidebarData = { itemTypes, favoriteCollections, recentCollections };
    }
  } catch (err) {
    console.error('Failed to load sidebar data:', err);
  }

  return <DashboardShell sidebarData={sidebarData}>{children}</DashboardShell>;
}
