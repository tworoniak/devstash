import { prisma } from '@/lib/prisma';

const DASHBOARD_RECENT_ITEMS_LIMIT = 10;

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
