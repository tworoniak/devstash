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
      className='flex items-center gap-3 px-3 py-2 rounded hover:bg-accent/40 transition-colors cursor-pointer group'
      onClick={() => openDrawer(item.id)}
    >
      <Icon className='h-3.5 w-3.5 shrink-0' style={{ color }} />
      <span className='flex-1 text-sm text-foreground truncate font-mono'>{item.title}</span>
      <span
        className='text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0'
        style={{ color, backgroundColor: `${color}18` }}
      >
        {item.itemType.name}
      </span>
      <span className='text-xs text-muted-foreground font-mono shrink-0 w-20 text-right'>
        {formatDate(item.updatedAt)}
      </span>
    </div>
  );
}
