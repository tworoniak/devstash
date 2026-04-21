'use client';

import { Code, Star, Pin } from 'lucide-react';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { formatDate } from '@/lib/utils';
import { useItemDrawer } from '@/components/items/item-drawer-provider';

interface ItemRowProps {
  item: {
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
  };
}

export function ItemRow({ item }: ItemRowProps) {
  const { openDrawer } = useItemDrawer();
  const Icon = ICON_MAP[item.itemType.icon] ?? Code;
  const color = item.itemType.color;

  return (
    <div
      className="group flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer border border-border"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      onClick={() => openDrawer(item.id)}
    >
      {/* Type icon */}
      <div
        className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
          {item.isFavorite && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          )}
          {item.isPinned && (
            <Pin className="h-3 w-3 text-blue-400 fill-blue-400 shrink-0" />
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Date */}
      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{formatDate(item.createdAt)}</span>
    </div>
  );
}
