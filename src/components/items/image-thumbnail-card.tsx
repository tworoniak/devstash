'use client';

import { Star, Pin, ImageIcon } from 'lucide-react';
import { useItemDrawer } from '@/components/items/item-drawer-provider';

interface ImageThumbnailCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    isFavorite: boolean;
    isPinned: boolean;
    fileUrl: string | null;
  };
}

export function ImageThumbnailCard({ item }: ImageThumbnailCardProps) {
  const { openDrawer } = useItemDrawer();

  return (
    <div
      className="group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-border/80 transition-colors"
      onClick={() => openDrawer(item.id)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted overflow-hidden">
        {item.fileUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/download/${item.id}`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate flex-1">{item.title}</span>
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
      </div>
    </div>
  );
}
