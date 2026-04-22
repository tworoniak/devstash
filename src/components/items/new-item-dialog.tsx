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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createItem } from '@/actions/items';
import { getUserCollections } from '@/actions/collections';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/items/code-editor';
import { MarkdownEditor } from '@/components/items/markdown-editor';
import { FileUpload } from '@/components/items/file-upload';
import { CollectionSelector } from '@/components/shared/collection-selector';
import type { UploadResult } from '@/components/items/file-upload';
import type { UserCollection } from '@/lib/db/collections';

const ITEM_TYPES = [
  { value: 'snippet', label: 'Snippet' },
  { value: 'prompt', label: 'Prompt' },
  { value: 'command', label: 'Command' },
  { value: 'note', label: 'Note' },
  { value: 'link', label: 'Link' },
  { value: 'file', label: 'File' },
  { value: 'image', label: 'Image' },
] as const;

export type ItemTypeName = (typeof ITEM_TYPES)[number]['value'];

const CONTENT_TYPES = new Set<ItemTypeName>(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set<ItemTypeName>(['snippet', 'command']);
const FILE_TYPES = new Set<ItemTypeName>(['file', 'image']);

interface FormState {
  typeName: ItemTypeName;
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
  uploadResult: UploadResult | null;
}

function FormField({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function defaultForm(): FormState {
  return {
    typeName: 'snippet',
    title: '',
    description: '',
    content: '',
    url: '',
    language: '',
    tags: '',
    uploadResult: null,
  };
}

interface NewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: ItemTypeName;
}

export function NewItemDialog({ open, onOpenChange, defaultType }: NewItemDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    defaultType ? { ...defaultForm(), typeName: defaultType } : defaultForm()
  );
  const [saving, setSaving] = useState(false);
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (defaultType) setForm((prev) => ({ ...prev, typeName: defaultType }));
    getUserCollections().then((result) => {
      if (result.success) setCollections(result.data);
    });
  }, [open, defaultType]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(value: ItemTypeName | null) {
    if (!value) return;
    setForm((prev) => ({ ...defaultForm(), typeName: value, title: prev.title }));
  }

  function handleClose() {
    onOpenChange(false);
    setForm(defaultType ? { ...defaultForm(), typeName: defaultType } : defaultForm());
    setSelectedCollectionIds([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      typeName: form.typeName,
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
      fileKey: form.uploadResult?.key ?? null,
      fileName: form.uploadResult?.fileName ?? null,
      fileSize: form.uploadResult?.fileSize ?? null,
      collectionIds: selectedCollectionIds,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Item created');
    handleClose();
    router.refresh();
  }

  const showContent = CONTENT_TYPES.has(form.typeName);
  const showLanguage = LANGUAGE_TYPES.has(form.typeName);
  const showUrl = form.typeName === 'link';
  const showFileUpload = FILE_TYPES.has(form.typeName);

  const canSubmit =
    form.title.trim().length > 0 &&
    (!showUrl || form.url.trim().length > 0) &&
    (!showFileUpload || form.uploadResult !== null);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <FormField label="Type" htmlFor="item-type">
            <Select value={form.typeName} onValueChange={handleTypeChange}>
              <SelectTrigger id="item-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Title" htmlFor="item-title" required>
            <Input
              id="item-title"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Item title"
              autoFocus
              className="text-sm"
            />
          </FormField>

          <FormField label="Description" htmlFor="item-description">
            <Textarea
              id="item-description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="text-sm resize-none"
            />
          </FormField>

          {showUrl && (
            <FormField label="URL" htmlFor="item-url" required>
              <Input
                id="item-url"
                value={form.url}
                onChange={(e) => setField('url', e.target.value)}
                placeholder="https://…"
                type="url"
                className="text-sm"
              />
            </FormField>
          )}

          {showFileUpload && (
            <FormField label={form.typeName === 'image' ? 'Image' : 'File'} required>
              <FileUpload
                itemType={form.typeName as 'file' | 'image'}
                uploaded={form.uploadResult}
                onUpload={(result) => setField('uploadResult', result)}
                onRemove={() => setField('uploadResult', null)}
              />
            </FormField>
          )}

          {showContent && (
            <FormField label="Content">
              {showLanguage ? (
                <CodeEditor
                  value={form.content}
                  language={form.language}
                  onChange={(v) => setField('content', v)}
                />
              ) : (
                <MarkdownEditor
                  value={form.content}
                  onChange={(v) => setField('content', v)}
                />
              )}
            </FormField>
          )}

          {showLanguage && (
            <FormField label="Language" htmlFor="item-language">
              <Input
                id="item-language"
                value={form.language}
                onChange={(e) => setField('language', e.target.value)}
                placeholder="e.g. typescript"
                className="text-sm"
              />
            </FormField>
          )}

          <FormField label="Tags" htmlFor="item-tags" hint="Comma-separated">
            <Input
              id="item-tags"
              value={form.tags}
              onChange={(e) => setField('tags', e.target.value)}
              placeholder="react, hooks, auth"
              className="text-sm"
            />
          </FormField>

          <FormField label="Collections">
            <CollectionSelector
              collections={collections}
              selected={selectedCollectionIds}
              onChange={setSelectedCollectionIds}
            />
          </FormField>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !canSubmit}>
              {saving ? 'Creating…' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
