import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getSidebarItemTypes } from '@/lib/db/items';
import { getSidebarFavoriteCollections, getSidebarRecentCollections } from '@/lib/db/collections';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import type { SidebarData } from '@/components/layout/sidebar';

export default async function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const userId = session.user.id;
  let sidebarData: SidebarData | null = null;

  try {
    const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
      getSidebarItemTypes(userId),
      getSidebarFavoriteCollections(userId),
      getSidebarRecentCollections(userId),
    ]);
    sidebarData = { itemTypes, favoriteCollections, recentCollections };
  } catch (err) {
    console.error('Failed to load sidebar data:', err);
  }

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };

  return (
    <DashboardShell sidebarData={sidebarData} user={user}>
      {children}
    </DashboardShell>
  );
}
