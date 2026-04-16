import { prisma } from '@/lib/prisma';

const DASHBOARD_COLLECTIONS_LIMIT = 6;

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  accentColor: string;
  typeIcons: { icon: string; color: string }[];
}

export async function getDashboardCollections(userId: string): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: DASHBOARD_COLLECTIONS_LIMIT,
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    // Count items per type
    const typeCounts = new Map<string, { count: number; icon: string; color: string }>();
    for (const { item } of col.items) {
      const { id, icon, color } = item.itemType;
      const existing = typeCounts.get(id);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(id, { count: 1, icon, color });
      }
    }

    // Sort by count descending
    const sorted = Array.from(typeCounts.values()).sort((a, b) => b.count - a.count);

    const accentColor = sorted[0]?.color ?? '#3b82f6';
    const typeIcons = sorted.map(({ icon, color }) => ({ icon, color }));

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      accentColor,
      typeIcons,
    };
  });
}
