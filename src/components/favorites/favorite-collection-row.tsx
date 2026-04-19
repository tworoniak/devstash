import Link from 'next/link';
import { Folder } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface FavoriteCollectionRowProps {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    itemCount: number;
    accentColor: string;
  };
}

export function FavoriteCollectionRow({ collection }: FavoriteCollectionRowProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className='flex items-center gap-3 px-3 py-2 rounded hover:bg-accent/40 transition-colors group'
    >
      <Folder
        className='h-3.5 w-3.5 shrink-0'
        style={{ color: collection.accentColor }}
      />
      <span className='flex-1 text-sm text-foreground truncate font-mono'>{collection.name}</span>
      <span className='text-[10px] font-mono text-muted-foreground shrink-0'>
        {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
      </span>
      <span className='text-xs text-muted-foreground font-mono shrink-0 w-20 text-right'>
        {formatDate(collection.updatedAt)}
      </span>
    </Link>
  );
}
