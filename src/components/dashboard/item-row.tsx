import { Code, Star, Pin } from 'lucide-react';
import { mockItemTypes } from '@/lib/mock-data';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { formatDate } from '@/lib/utils';

interface Item {
  id: string;
  title: string;
  description: string | null;
  itemTypeId: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
}


interface ItemRowProps {
  item: Item;
}

export function ItemRow({ item }: ItemRowProps) {
  const type = mockItemTypes.find((t) => t.id === item.itemTypeId);
  const Icon = type ? (ICON_MAP[type.icon] ?? Code) : Code;
  const color = type?.color ?? '#3b82f6';

  return (
    <div
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-border"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
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
                key={tag}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
              >
                {tag}
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
