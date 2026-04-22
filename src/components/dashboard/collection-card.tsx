'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MoreHorizontal, Code, Pencil, Trash2 } from 'lucide-react';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { timeAgo } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditCollectionDialog } from '@/components/collections/edit-collection-dialog';
import { deleteCollection, toggleCollectionFavorite } from '@/actions/collections';
import { toast } from 'sonner';

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string | null;
    isFavorite: boolean;
    itemCount: number;
    updatedAt: Date;
    accentColor: string;
    typeIcons: { icon: string; color: string }[];
    typeBars: { color: string; percentage: number }[];
    recentItems: { id: string; title: string; icon: string; color: string }[];
  };
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const { accentColor, typeBars, recentItems } = collection;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(collection.isFavorite);

  async function handleFavorite() {
    setIsFavorite((prev) => !prev);
    const result = await toggleCollectionFavorite(collection.id);
    if (!result.success) {
      setIsFavorite((prev) => !prev);
      toast.error(result.error);
      return;
    }
    toast.success(result.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    router.refresh();
  }

  function handleCardClick() {
    router.push(`/collections/${collection.id}`);
  }

  function stopProp(e: React.MouseEvent) {
    e.stopPropagation();
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCollection(collection.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Collection deleted');
    router.refresh();
  }

  return (
    <>
      <div
        role="link"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        className="group relative bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-border/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer"
        style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{collection.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
              {' · '}updated {timeAgo(collection.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0" onClick={stopProp}>
            {isFavorite && (
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors opacity-0 group-hover:opacity-100 bg-transparent border-0 cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFavorite}>
                  <Star className={`h-3.5 w-3.5 mr-2 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  {isFavorite ? 'Unfavorite' : 'Favorite'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Type color bar */}
        {typeBars.length > 0 && (
          <div className="flex h-1 rounded-full overflow-hidden gap-px">
            {typeBars.map(({ color, percentage }, i) => (
              <div
                key={i}
                className="h-full rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Recent items */}
        {recentItems.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {recentItems.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Code;
              return (
                <div key={item.id} className="flex items-center gap-2 min-w-0">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: item.color }} />
                  <span className="text-xs text-muted-foreground truncate">{item.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EditCollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        collection={collection}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete collection?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{collection.name}&rdquo; will be permanently deleted. Items in this collection will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
