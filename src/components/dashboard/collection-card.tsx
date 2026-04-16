'use client';

import Link from 'next/link';
import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon } from 'lucide-react';

// Dominant color per collection for the left border accent
const COLLECTION_COLORS: Record<string, string> = {
  coll_1: '#3b82f6', // React Patterns → snippet blue
  coll_2: '#3b82f6', // Python Snippets → snippet blue
  coll_3: '#6b7280', // Context Files → file gray
  coll_4: '#3b82f6', // Interview Prep → snippet blue
  coll_5: '#f97316', // Git Commands → command orange
  coll_6: '#8b5cf6', // AI Prompts → prompt purple
};

// Type icons shown at the bottom of each card
const COLLECTION_TYPE_ICONS: Record<string, { icon: React.ElementType; color: string }[]> = {
  coll_1: [{ icon: Code, color: '#3b82f6' }, { icon: StickyNote, color: '#fde047' }, { icon: LinkIcon, color: '#10b981' }],
  coll_2: [{ icon: Code, color: '#3b82f6' }, { icon: Terminal, color: '#f97316' }],
  coll_3: [{ icon: File, color: '#6b7280' }, { icon: Image, color: '#ec4899' }],
  coll_4: [{ icon: Code, color: '#3b82f6' }, { icon: StickyNote, color: '#fde047' }, { icon: Terminal, color: '#f97316' }],
  coll_5: [{ icon: Terminal, color: '#f97316' }, { icon: LinkIcon, color: '#10b981' }],
  coll_6: [{ icon: Sparkles, color: '#8b5cf6' }, { icon: Code, color: '#3b82f6' }],
};

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string | null;
    isFavorite: boolean;
    itemCount: number;
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const accentColor = COLLECTION_COLORS[collection.id] ?? '#3b82f6';
  const typeIcons = COLLECTION_TYPE_ICONS[collection.id] ?? [];

  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="group relative bg-card border border-border rounded-lg p-4 h-full flex flex-col gap-2 hover:border-border/80 hover:bg-card/80 transition-colors cursor-pointer"
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
            {typeIcons.map(({ icon: Icon, color }, i) => (
              <Icon key={i} className="h-3.5 w-3.5" style={{ color }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
