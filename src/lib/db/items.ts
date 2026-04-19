import { prisma } from '@/lib/prisma';

const DASHBOARD_RECENT_ITEMS_LIMIT = 10;

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export async function getSidebarItemTypes(userId: string): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      _count: {
        select: { items: { where: { userId } } },
      },
    },
  });
  return types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    count: t._count.items,
  }));
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  tags: { name: string }[];
  itemType: {
    icon: string;
    color: string;
  };
}

const itemSelect = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  createdAt: true,
  tags: { select: { name: true } },
  itemType: { select: { icon: true, color: true } },
} as const;

export async function getDashboardPinnedItems(userId: string): Promise<DashboardItem[]> {
  return prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: 'desc' },
    select: itemSelect,
  });
}

export async function getDashboardRecentItems(userId: string): Promise<DashboardItem[]> {
  return prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: DASHBOARD_RECENT_ITEMS_LIMIT,
    select: itemSelect,
  });
}

export interface ItemDetail {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: { name: string }[];
  collections: { collection: { id: string; name: string } }[];
  itemType: { name: string; icon: string; color: string };
}

export async function getItemById(id: string, userId: string): Promise<ItemDetail | null> {
  return prisma.item.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      description: true,
      contentType: true,
      content: true,
      fileUrl: true,
      fileName: true,
      fileSize: true,
      url: true,
      language: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      tags: { select: { name: true } },
      collections: {
        select: {
          collection: { select: { id: true, name: true } },
        },
      },
      itemType: { select: { name: true, icon: true, color: true } },
    },
  });
}

export interface UpdateItemData {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
}

export async function updateItem(
  id: string,
  userId: string,
  data: UpdateItemData
): Promise<ItemDetail | null> {
  const existing = await prisma.item.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) return null;

  return prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        set: [],
        connectOrCreate: data.tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      contentType: true,
      content: true,
      fileUrl: true,
      fileName: true,
      fileSize: true,
      url: true,
      language: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      tags: { select: { name: true } },
      collections: {
        select: {
          collection: { select: { id: true, name: true } },
        },
      },
      itemType: { select: { name: true, icon: true, color: true } },
    },
  });
}

export async function deleteItem(id: string, userId: string): Promise<boolean> {
  const existing = await prisma.item.findFirst({ where: { id, userId }, select: { id: true } });
  if (!existing) return false;

  await prisma.item.delete({ where: { id } });
  return true;
}

export async function getItemsByType(userId: string, typeName: string): Promise<DashboardItem[]> {
  return prisma.item.findMany({
    where: {
      userId,
      itemType: { name: typeName },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    select: itemSelect,
  });
}
