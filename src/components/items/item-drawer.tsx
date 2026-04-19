'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Star, Pin, Copy, Pencil, Trash2, Save, X, Download, FileText, ImageIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { buttonVariants } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { updateItem, deleteItem, toggleItemPin } from '@/actions/items';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/items/code-editor';
import { MarkdownEditor } from '@/components/items/markdown-editor';
import type { ItemDetail } from '@/lib/db/items';

const TEXT_CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
const LANGUAGE_TYPES = new Set(['snippet', 'command']);

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

interface EditState {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
}

function itemToEditState(item: ItemDetail): EditState {
  return {
    title: item.title,
    description: item.description ?? '',
    content: item.content ?? '',
    url: item.url ?? '',
    language: item.language ?? '',
    tags: item.tags.map((t) => t.name).join(', '),
  };
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (item) setIsPinned(item.isPinned);
  }, [item]);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setError(false);
      setEditMode(false);
      setEditState(null);
      return;
    }
    setLoading(true);
    setError(false);
    setEditMode(false);
    setEditState(null);
    fetch(`/api/items/${itemId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ItemDetail>;
      })
      .then((data) => setItem(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [itemId]);

  function handleEditStart() {
    if (!item) return;
    setEditState(itemToEditState(item));
    setEditMode(true);
  }

  function handleCancel() {
    setEditMode(false);
    setEditState(null);
  }

  async function handleTogglePin() {
    if (!item) return;
    setIsPinned((prev) => !prev);
    const result = await toggleItemPin(item.id);
    if (!result.success) {
      setIsPinned((prev) => !prev);
      toast.error(result.error);
      return;
    }
    toast.success(result.data.isPinned ? 'Item pinned' : 'Item unpinned');
    router.refresh();
  }

  async function handleSave() {
    if (!item || !editState) return;
    setSaving(true);
    const tags = editState.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(item.id, {
      title: editState.title,
      description: editState.description || null,
      content: editState.content || null,
      url: editState.url || null,
      language: editState.language || null,
      tags,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setItem(result.data);
    setEditMode(false);
    setEditState(null);
    toast.success('Item updated');
    router.refresh();
  }

  async function handleDelete() {
    if (!item) return;
    setDeleting(true);
    setDeleteConfirmOpen(false);
    const result = await deleteItem(item.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Item deleted');
    onClose();
    router.refresh();
  }

  function updateField(field: keyof EditState, value: string) {
    setEditState((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  const open = !!itemId;
  const Icon = item ? (ICON_MAP[item.itemType.icon] ?? Code) : Code;
  const color = item?.itemType.color ?? '#6b7280';
  const typeName = item?.itemType.name ?? '';
  const showContent = TEXT_CONTENT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showUrl = typeName === 'link';
  const showFileItem = typeName === 'file' || typeName === 'image';

  return (
    <>
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="right" className="sm:max-w-xl overflow-y-auto p-0" showCloseButton>
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
                {!editMode && item.language && (
                  <Badge variant="outline" className="text-xs">
                    {item.language}
                  </Badge>
                )}
              </div>
              {editMode ? (
                <Input
                  value={editState?.title ?? ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="text-base font-semibold pr-8"
                  placeholder="Title"
                />
              ) : (
                <SheetTitle className="text-base leading-snug pr-8">
                  {item.title}
                </SheetTitle>
              )}
            </SheetHeader>

            {/* Action bar */}
            {editMode ? (
              <div className="flex items-center gap-2 px-3 py-2 border-y border-border">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleSave}
                  disabled={saving || !editState?.title.trim()}
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-y border-border">
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
                  className={`gap-1.5 ${isPinned ? 'text-blue-400' : ''}`}
                  onClick={handleTogglePin}
                >
                  <Pin className={`h-4 w-4 ${isPinned ? 'fill-blue-400' : ''}`} />
                  Pin
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                {showFileItem && item.fileUrl && (
                  <a
                    href={`/api/download/${item.id}`}
                    download={item.fileName ?? undefined}
                    className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' gap-1.5'}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleEditStart}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}

            {/* Body */}
            <div className="px-4 py-4 space-y-5">
              {editMode && editState ? (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editState.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Optional description"
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>

                  {showUrl && (
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-url" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        URL
                      </Label>
                      <Input
                        id="edit-url"
                        value={editState.url}
                        onChange={(e) => updateField('url', e.target.value)}
                        placeholder="https://…"
                        type="url"
                        className="text-sm"
                      />
                    </div>
                  )}

                  {showContent && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Content
                      </Label>
                      {showLanguage ? (
                        <CodeEditor
                          value={editState.content}
                          language={editState.language}
                          onChange={(v) => updateField('content', v)}
                        />
                      ) : (
                        <MarkdownEditor
                          value={editState.content}
                          onChange={(v) => updateField('content', v)}
                        />
                      )}
                    </div>
                  )}

                  {showLanguage && (
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-language" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Language
                      </Label>
                      <Input
                        id="edit-language"
                        value={editState.language}
                        onChange={(e) => updateField('language', e.target.value)}
                        placeholder="e.g. typescript"
                        className="text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-tags" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Tags
                    </Label>
                    <Input
                      id="edit-tags"
                      value={editState.tags}
                      onChange={(e) => updateField('tags', e.target.value)}
                      placeholder="react, hooks, auth"
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated</p>
                  </div>

                  {/* Non-editable: collections + dates */}
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
                </>
              ) : (
                <>
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

                  {showFileItem && item.fileUrl && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {typeName === 'image' ? 'Image' : 'File'}
                      </p>
                      {typeName === 'image' ? (
                        <div className="rounded-lg border border-border overflow-hidden">
                          <div className="bg-muted/30 flex items-center justify-center p-3 max-h-64 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.fileUrl}`}
                              alt={item.fileName ?? item.title}
                              className="max-h-56 max-w-full object-contain rounded"
                            />
                          </div>
                          {item.fileName && (
                            <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
                              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-sm truncate">{item.fileName}</span>
                              {item.fileSize != null && (
                                <span className="text-xs text-muted-foreground ml-auto shrink-0">
                                  {formatFileSize(item.fileSize)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.fileName ?? 'File'}
                            </p>
                            {item.fileSize != null && (
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(item.fileSize)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!showFileItem && item.content && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        Content
                      </p>
                      {showLanguage ? (
                        <CodeEditor
                          value={item.content}
                          language={item.language ?? undefined}
                          readOnly
                        />
                      ) : (
                        <MarkdownEditor
                          value={item.content}
                          readOnly
                        />
                      )}
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
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>

    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{item?.title}&rdquo;? This action cannot be undone.
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
