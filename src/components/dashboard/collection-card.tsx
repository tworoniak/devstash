'use client';

import Link from 'next/link';
import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon, LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
};

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string | null;
    isFavorite: boolean;
    itemCount: number;
    accentColor: string;
    typeIcons: { icon: string; color: string }[];
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { accentColor, typeIcons } = collection;

  return (
    <Link href={`/collections/${collection.id}`}>
      <div
        className="group relative bg-card border border-border rounded-lg p-4 h-full flex flex-col gap-2 hover:border-border/80 hover:bg-card/80 transition-colors cursor-pointer"
        style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-foreground truncate">{collection.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{collection.itemCount} items</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {collection.isFavorite && (
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            )}
            <button
              onClick={(e) => e.preventDefault()}
              className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {collection.description}
          </p>
        )}

        {/* Type icon strip */}
        {typeIcons.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {typeIcons.map(({ icon, color }, i) => {
              const Icon = ICON_MAP[icon] ?? Code;
              return <Icon key={i} className="h-3.5 w-3.5" style={{ color }} />;
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
