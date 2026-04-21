'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MoreHorizontal, Code, Pencil, Trash2 } from 'lucide-react';
import { ICON_MAP } from '@/lib/constants/icon-map';
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
import { deleteCollection } from '@/actions/collections';
import { toast } from 'sonner';

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
  const router = useRouter();
  const { accentColor, typeIcons } = collection;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        className="group relative bg-card border border-border rounded-lg p-4 h-full flex flex-col gap-2 hover:border-border/80 hover:bg-card/80 transition-colors cursor-pointer"
        style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-foreground truncate">{collection.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{collection.itemCount} items</p>
          </div>
          <div className="flex items-center gap-1 shrink-0" onClick={stopProp}>
            {collection.isFavorite && (
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
                <DropdownMenuItem disabled>
                  <Star className="h-3.5 w-3.5 mr-2" />
                  Favorite
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            {typeIcons.map(({ icon, color }) => {
              const Icon = ICON_MAP[icon] ?? Code;
              return <Icon key={icon} className="h-3.5 w-3.5" style={{ color }} />;
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
