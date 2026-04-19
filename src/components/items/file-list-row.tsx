'use client';

import { Download, FileText, FileImage, FileCode, FileArchive, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useItemDrawer } from '@/components/items/item-drawer-provider';
import { formatDate } from '@/lib/utils';

interface FileListRowProps {
  item: {
    id: string;
    title: string;
    fileName: string | null;
    fileSize: number | null;
    createdAt: Date;
    itemType: {
      color: string;
    };
  };
}

function getFileIcon(fileName: string | null) {
  if (!fileName) return File;
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return File;

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(ext)) return FileImage;
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'cs', 'php', 'sh', 'html', 'css', 'json', 'yaml', 'yml', 'toml', 'xml', 'sql', 'md'].includes(ext)) return FileCode;
  if (['zip', 'tar', 'gz', 'rar', '7z', 'bz2'].includes(ext)) return FileArchive;
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return FileText;

  return File;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileListRow({ item }: FileListRowProps) {
  const { openDrawer } = useItemDrawer();
  const Icon = getFileIcon(item.fileName);
  const color = item.itemType.color;

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    window.location.href = `/api/download/${item.id}`;
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group border border-border"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      onClick={() => openDrawer(item.id)}
    >
      {/* File icon */}
      <div className="shrink-0 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>

      {/* File name */}
      <span className="flex-1 text-sm font-medium text-foreground truncate min-w-0">
        {item.fileName ?? item.title}
      </span>

      {/* Meta — hidden on small screens, stacked below on mobile */}
      <div className="hidden sm:flex items-center gap-6 shrink-0 text-xs text-muted-foreground">
        <span className="w-16 text-right">{formatFileSize(item.fileSize)}</span>
        <span className="w-24 text-right">{formatDate(item.createdAt)}</span>
      </div>

      {/* Mobile meta */}
      <div className="flex sm:hidden flex-col items-end shrink-0 text-xs text-muted-foreground gap-0.5">
        <span>{formatFileSize(item.fileSize)}</span>
        <span>{formatDate(item.createdAt)}</span>
      </div>

      {/* Download button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDownload}
        aria-label="Download file"
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
