'use client';

import { useState, useEffect } from 'react';
import { Code, Star, Pin, Copy, Pencil, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { formatDate } from '@/lib/utils';
import type { ItemDetail } from '@/lib/db/items';

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    fetch(`/api/items/${itemId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ItemDetail>;
      })
      .then((data) => setItem(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [itemId]);

  const open = !!itemId;
  const Icon = item ? (ICON_MAP[item.itemType.icon] ?? Code) : Code;
  const color = item?.itemType.color ?? '#6b7280';

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto p-0" showCloseButton>
        {loading && <DrawerSkeleton />}
        {!loading && error && (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-sm text-muted-foreground">Failed to load item.</p>
          </div>
        )}
        {!loading && !error && item && (
          <>
            {/* Header */}
            <SheetHeader className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <Badge variant="secondary" className="text-xs capitalize">
                  {item.itemType.name}
                </Badge>
                {item.language && (
                  <Badge variant="outline" className="text-xs">
                    {item.language}
                  </Badge>
                )}
              </div>
              <SheetTitle className="text-base leading-snug pr-8">
                {item.title}
              </SheetTitle>
            </SheetHeader>

            {/* Action bar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-y border-border">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${item.isFavorite ? 'text-amber-400' : ''}`}
              >
                <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                Favorite
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${item.isPinned ? 'text-blue-400' : ''}`}
              >
                <Pin className={`h-4 w-4 ${item.isPinned ? 'fill-blue-400' : ''}`} />
                Pin
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>

            {/* Body */}
            <div className="px-4 py-4 space-y-5">
              {item.description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    Description
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
                </div>
              )}

              {item.url && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    URL
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </div>
              )}

              {item.content && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    Content
                  </p>
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap wrap-break-word leading-relaxed">
                    {item.content}
                  </pre>
                </div>
              )}

              {item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag.name} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.collections.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    Collections
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map(({ collection }) => (
                      <Badge key={collection.id} variant="outline" className="text-xs">
                        {collection.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Details
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span>{formatDate(new Date(item.createdAt))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated</span>
                    <span>{formatDate(new Date(item.updatedAt))}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DrawerSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-muted" />
        <div className="h-5 w-16 rounded bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted" />
      <div className="h-px bg-border" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 rounded bg-muted" />
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
