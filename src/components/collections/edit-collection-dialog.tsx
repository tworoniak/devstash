'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateCollection } from '@/actions/collections';
import { toast } from 'sonner';

interface EditCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function EditCollectionDialog({ open, onOpenChange, collection }: EditCollectionDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(collection.name);
      setDescription(collection.description ?? '');
    }
  }, [open, collection]);

  function handleClose() {
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const result = await updateCollection({
      id: collection.id,
      name,
      description: description || null,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Collection updated');
    handleClose();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-collection-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              autoFocus
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-collection-description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </Label>
            <Textarea
              id="edit-collection-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || name.trim().length === 0}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
