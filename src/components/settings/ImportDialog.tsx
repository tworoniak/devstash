'use client';

import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Upload, FileJson, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { previewImport, importData } from '@/actions/import';
import type { ImportSummary } from '@/lib/import-schema';

type State = 'idle' | 'parsing' | 'preview' | 'importing';

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function SummaryLine({ label, count }: { label: string; count: number }) {
  return (
    <div className='flex items-center justify-between text-sm'>
      <span className='text-muted-foreground capitalize'>{label}</span>
      <span className='font-medium text-foreground'>{count}</span>
    </div>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>('idle');
  const [jsonString, setJsonString] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setState('idle');
    setJsonString(null);
    setFileName('');
    setSummary(null);
    setError(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  async function processFile(file: File) {
    if (!file.name.endsWith('.json')) {
      setError('Please select a .json file');
      return;
    }

    setState('parsing');
    setError(null);
    setFileName(file.name);

    const text = await file.text();
    setJsonString(text);

    const result = await previewImport(text);
    if (!result.success) {
      setError(result.error);
      setState('idle');
      return;
    }

    setSummary(result.data);
    setState('preview');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleImport() {
    if (!jsonString) return;
    setState('importing');

    startTransition(async () => {
      const result = await importData(jsonString, skipDuplicates);
      if (!result.success) {
        setError(result.error);
        setState('preview');
        return;
      }

      const { itemsImported, collectionsImported } = result.data;
      const parts = [];
      if (itemsImported > 0) parts.push(pluralize(itemsImported, 'item'));
      if (collectionsImported > 0) parts.push(pluralize(collectionsImported, 'collection'));
      const message =
        parts.length > 0
          ? `Imported ${parts.join(' and ')}`
          : 'No new items to import';

      toast.success(message);
      handleClose(false);
      router.refresh();
    });
  }

  const totalItems = summary
    ? Object.values(summary.itemsByType).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Import from JSON</DialogTitle>
        </DialogHeader>

        {state === 'idle' || state === 'parsing' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={[
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/40',
            ].join(' ')}
          >
            <Upload className='size-8 text-muted-foreground' />
            <div className='text-center'>
              <p className='text-sm font-medium text-foreground'>
                Drop your export file here
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                or click to browse — .json files only
              </p>
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              className='hidden'
              onChange={handleFileChange}
            />
            {state === 'parsing' && (
              <p className='text-xs text-muted-foreground animate-pulse'>Parsing file…</p>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {/* File info */}
            <div className='flex items-center gap-2 rounded-md bg-muted/40 border border-border px-3 py-2'>
              <FileJson className='size-4 text-muted-foreground shrink-0' />
              <span className='text-sm text-foreground truncate flex-1'>{fileName}</span>
              <button
                onClick={reset}
                className='text-muted-foreground hover:text-foreground transition-colors'
                aria-label='Remove file'
              >
                <X className='size-4' />
              </button>
            </div>

            {/* Summary */}
            {summary && (
              <div className='rounded-md bg-muted/40 border border-border px-3 py-3 space-y-1.5'>
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2'>
                  Preview
                </p>
                {Object.entries(summary.itemsByType).map(([type, count]) => (
                  <SummaryLine key={type} label={`${type}s`} count={count} />
                ))}
                {totalItems === 0 && (
                  <p className='text-sm text-muted-foreground'>No items in this export</p>
                )}
                <div className='border-t border-border my-2' />
                <SummaryLine label='collections' count={summary.collectionCount} />
                <SummaryLine label='tags' count={summary.tagCount} />
              </div>
            )}

            {/* Skip duplicates toggle */}
            <div className='flex items-center justify-between'>
              <Label htmlFor='skip-duplicates' className='text-sm cursor-pointer'>
                Skip duplicates
                <span className='block text-xs text-muted-foreground font-normal'>
                  Match on title, type, and content
                </span>
              </Label>
              <Switch
                id='skip-duplicates'
                checked={skipDuplicates}
                onCheckedChange={setSkipDuplicates}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className='text-sm text-destructive'>{error}</p>
        )}

        {/* Actions */}
        {(state === 'preview' || state === 'importing') && (
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' onClick={() => handleClose(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isPending || totalItems === 0}>
              {isPending ? 'Importing…' : 'Import'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
