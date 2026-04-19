import { prisma } from '@/lib/prisma';

const DASHBOARD_COLLECTIONS_LIMIT = 6;
const SIDEBAR_COLLECTIONS_LIMIT = 5;

export interface SidebarCollection {
  id: string;
  name: string;
  accentColor: string;
}

function dominantColor(
  items: { item: { itemType: { id: string; color: string } } }[]
): string {
  const counts = new Map<string, { count: number; color: string }>();
  for (const { item } of items) {
    const { id, color } = item.itemType;
    const existing = counts.get(id);
    if (existing) existing.count++;
    else counts.set(id, { count: 1, color });
  }
  const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
  return sorted[0]?.color ?? '#3b82f6';
}

const collectionItemsInclude = {
  items: {
    include: {
      item: { include: { itemType: { select: { id: true, color: true } } } },
    },
  },
} as const;

export async function getSidebarFavoriteCollections(
  userId: string
): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    take: SIDEBAR_COLLECTIONS_LIMIT,
    include: collectionItemsInclude,
  });
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    accentColor: dominantColor(col.items),
  }));
}

export async function getSidebarRecentCollections(
  userId: string
): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: SIDEBAR_COLLECTIONS_LIMIT,
    include: collectionItemsInclude,
  });
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    accentColor: dominantColor(col.items),
  }));
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  accentColor: string;
  typeIcons: { icon: string; color: string }[];
}

export interface FavoriteCollection {
  id: string;
  name: string;
  description: string | null;
  updatedAt: Date;
  itemCount: number;
  accentColor: string;
}

export async function getFavoriteCollections(userId: string): Promise<FavoriteCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    include: collectionItemsInclude,
  });
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description,
    updatedAt: col.updatedAt,
    itemCount: col.items.length,
    accentColor: dominantColor(col.items),
  }));
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
