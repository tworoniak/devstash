import { prisma } from '@/lib/prisma';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  hasPassword: boolean;
  createdAt: Date;
}

export interface ProfileItemTypeStat {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface ProfileStats {
  totalItems: number;
  totalCollections: number;
  itemTypeCounts: ProfileItemTypeStat[];
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: !!user.password,
    createdAt: user.createdAt,
  };
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: {
        _count: {
          select: { items: { where: { userId } } },
        },
      },
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    itemTypeCounts: itemTypes.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    })),
  };
}
