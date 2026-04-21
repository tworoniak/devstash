'use client';

import { Code } from 'lucide-react';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { formatDate } from '@/lib/utils';
import { useItemDrawer } from '@/components/items/item-drawer-provider';

interface FavoriteItemRowProps {
  item: {
    id: string;
    title: string;
    updatedAt: Date;
    itemType: {
      name: string;
      icon: string;
      color: string;
    };
  };
}

export function FavoriteItemRow({ item }: FavoriteItemRowProps) {
  const { openDrawer } = useItemDrawer();
  const Icon = ICON_MAP[item.itemType.icon] ?? Code;
  const color = item.itemType.color;

  return (
    <div
      className='flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer'
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      onClick={() => openDrawer(item.id)}
    >
      <div
        className='h-8 w-8 rounded-md flex items-center justify-center shrink-0'
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className='h-4 w-4' style={{ color }} />
      </div>
      <span className='flex-1 text-sm text-foreground truncate'>{item.title}</span>
      <span
        className='text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0'
        style={{ color, backgroundColor: `${color}18` }}
      >
        {item.itemType.name}
      </span>
      <span className='text-xs text-muted-foreground shrink-0 w-16 text-right'>
        {formatDate(item.updatedAt)}
      </span>
    </div>
  );
}
