import { prisma } from '@/lib/prisma';
import { DASHBOARD_COLLECTIONS_LIMIT, COLLECTIONS_PER_PAGE } from '@/lib/constants/pagination';
import { itemSelect, type DashboardItem } from '@/lib/db/items';

export interface UserCollection {
  id: string;
  name: string;
}

export async function getUserCollections(userId: string): Promise<UserCollection[]> {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
}

export interface CreatedCollection {
  id: string;
  name: string;
  description: string | null;
}

export async function createCollection(
  userId: string,
  data: { name: string; description?: string | null }
): Promise<CreatedCollection> {
  return prisma.collection.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      userId,
    },
    select: { id: true, name: true, description: true },
  });
}

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
  updatedAt: Date;
  accentColor: string;
  typeIcons: { icon: string; color: string }[];
  typeBars: { color: string; percentage: number }[];
  recentItems: { id: string; title: string; icon: string; color: string }[];
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

type CollectionWithItems = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  items: {
    addedAt: Date;
    item: {
      id: string;
      title: string;
      itemType: { id: string; icon: string; color: string };
    };
  }[];
};

function buildDashboardCollection(col: CollectionWithItems): DashboardCollection {
  const typeCounts = new Map<string, { count: number; icon: string; color: string }>();
  for (const { item } of col.items) {
    const { id, icon, color } = item.itemType;
    const existing = typeCounts.get(id);
    if (existing) existing.count++;
    else typeCounts.set(id, { count: 1, icon, color });
  }

  const sorted = Array.from(typeCounts.values()).sort((a, b) => b.count - a.count);
  const total = col.items.length;
  const accentColor = sorted[0]?.color ?? '#3b82f6';
  const typeIcons = sorted.map(({ icon, color }) => ({ icon, color }));
  const typeBars = sorted.map(({ color, count }) => ({
    color,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
  const recentItems = col.items.slice(0, 3).map(({ item }) => ({
    id: item.id,
    title: item.title,
    icon: item.itemType.icon,
    color: item.itemType.color,
  }));

  return {
    id: col.id,
    name: col.name,
    description: col.description,
    isFavorite: col.isFavorite,
    itemCount: total,
    updatedAt: col.updatedAt,
    accentColor,
    typeIcons,
    typeBars,
    recentItems,
  };
}

export async function getAllCollections(userId: string): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => buildDashboardCollection(col));
}

export async function getDashboardCollections(userId: string): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: DASHBOARD_COLLECTIONS_LIMIT,
    include: {
      items: {
        orderBy: { addedAt: 'desc' },
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => buildDashboardCollection(col));
}

export interface CollectionDetail {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  accentColor: string;
}

export async function updateCollection(
  id: string,
  userId: string,
  data: { name: string; description?: string | null }
): Promise<CreatedCollection | null> {
  const existing = await prisma.collection.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) return null;

  return prisma.collection.update({
    where: { id, userId },
    data: {
      name: data.name,
      description: data.description ?? null,
    },
    select: { id: true, name: true, description: true },
  });
}

export async function toggleCollectionFavorite(
  id: string,
  userId: string
): Promise<{ isFavorite: boolean } | null> {
  const existing = await prisma.collection.findFirst({
    where: { id, userId },
    select: { isFavorite: true },
  });
  if (!existing) return null;

  const updated = await prisma.collection.update({
    where: { id, userId },
    data: { isFavorite: !existing.isFavorite },
    select: { isFavorite: true },
  });
  return updated;
}

export async function deleteCollection(id: string, userId: string): Promise<boolean> {
  const existing = await prisma.collection.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) return false;

  await prisma.collection.delete({ where: { id, userId } });
  return true;
}

export async function getCollectionWithItems(
  id: string,
  userId: string,
  page: number = 1
): Promise<{ collection: CollectionDetail | null; items: DashboardItem[]; total: number }> {
  const collection = await prisma.collection.findFirst({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        include: {
          item: { include: { itemType: { select: { id: true, color: true } } } },
        },
      },
    },
  });

  if (!collection) return { collection: null, items: [], total: 0 };

  const accentColor = dominantColor(collection.items);

  const skip = (page - 1) * COLLECTIONS_PER_PAGE;
  const where = { collectionId: id, item: { userId } };

  const [itemCollections, total] = await Promise.all([
    prisma.itemCollection.findMany({
      where,
      orderBy: [{ item: { isPinned: 'desc' } }, { addedAt: 'desc' }],
      skip,
      take: COLLECTIONS_PER_PAGE,
      select: { item: { select: itemSelect } },
    }),
    prisma.itemCollection.count({ where }),
  ]);

  return {
    collection: {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      accentColor,
    },
    items: itemCollections.map((ic) => ic.item),
    total,
  };
}
