import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export interface SearchItem {
  id: string;
  title: string;
  typeIcon: string;
  typeColor: string;
  typeName: string;
}

export interface SearchCollection {
  id: string;
  name: string;
  itemCount: number;
}

export interface SearchData {
  items: SearchItem[];
  collections: SearchCollection[];
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const [items, collections] = await Promise.all([
    prisma.item.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        itemType: { select: { icon: true, color: true, name: true } },
      },
    }),
    prisma.collection.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } },
      },
    }),
  ]);

  const data: SearchData = {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      typeIcon: item.itemType.icon,
      typeColor: item.itemType.color,
      typeName: item.itemType.name,
    })),
    collections: collections.map((col) => ({
      id: col.id,
      name: col.name,
      itemCount: col._count.items,
    })),
  };

  return NextResponse.json(data);
}
