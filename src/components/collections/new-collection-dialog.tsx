'use client';

import { useState } from 'react';
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
import { createCollection } from '@/actions/collections';
import { toast } from 'sonner';

interface FormState {
  name: string;
  description: string;
}

function defaultForm(): FormState {
  return { name: '', description: '' };
}

interface NewCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCollectionDialog({ open, onOpenChange }: NewCollectionDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  function handleClose() {
    onOpenChange(false);
    setForm(defaultForm());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const result = await createCollection({
      name: form.name,
      description: form.description || null,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Collection created');
    handleClose();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="collection-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="collection-name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Collection name"
              autoFocus
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="collection-description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </Label>
            <Textarea
              id="collection-description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || form.name.trim().length === 0}>
              {saving ? 'Creating…' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
