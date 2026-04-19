'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UploadResult {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface FileUploadProps {
  itemType: 'file' | 'image';
  onUpload: (result: UploadResult) => void;
  onRemove: () => void;
  uploaded: UploadResult | null;
}

const IMAGE_EXTENSIONS = '.png,.jpg,.jpeg,.gif,.webp,.svg';
const FILE_EXTENSIONS = '.pdf,.txt,.md,.json,.yaml,.yml,.xml,.csv,.toml,.ini';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ itemType, onUpload, onRemove, uploaded }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    (file: File) => {
      setError(null);
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', itemType);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        setUploading(false);
        try {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText) as UploadResult;
            onUpload(result);
          } else {
            const body = JSON.parse(xhr.responseText) as { error?: string };
            setError(body.error ?? 'Upload failed');
          }
        } catch {
          setError('Upload failed. Please try again.');
        }
      });

      xhr.addEventListener('error', () => {
        setUploading(false);
        setError('Upload failed. Please try again.');
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    },
    [itemType, onUpload]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset so same file can be re-selected after removal
    e.target.value = '';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleRemove() {
    setError(null);
    setProgress(0);
    onRemove();
  }

  const accept = itemType === 'image' ? IMAGE_EXTENSIONS : FILE_EXTENSIONS;
  const maxLabel = itemType === 'image' ? '5 MB' : '10 MB';

  // Uploaded state
  if (uploaded) {
    const isImage = uploaded.mimeType.startsWith('image/');

    return (
      <div className="rounded-lg border border-border overflow-hidden">
        {isImage && (
          <div className="bg-muted/30 flex items-center justify-center p-3 max-h-48 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploaded.url}
              alt={uploaded.fileName}
              className="max-h-40 max-w-full object-contain rounded"
            />
          </div>
        )}
        <div className="flex items-center gap-3 px-3 py-2.5">
          {isImage ? (
            <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{uploaded.fileName}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(uploaded.fileSize)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
    );
  }

  // Uploading state
  if (uploading) {
    return (
      <div className="rounded-lg border border-border p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 animate-pulse" />
          <span>Uploading… {progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Drop zone
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        className={`w-full rounded-lg border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/50 hover:bg-muted/30'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Drop {itemType === 'image' ? 'an image' : 'a file'} here or{' '}
            <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {itemType === 'image'
              ? 'PNG, JPG, GIF, WebP, SVG'
              : 'PDF, TXT, MD, JSON, YAML, XML, CSV, TOML'}
            {' '}· Max {maxLabel}
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
