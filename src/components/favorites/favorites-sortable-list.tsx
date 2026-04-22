'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FavoriteItemRow } from './favorite-item-row';
import { FavoriteCollectionRow } from './favorite-collection-row';

type ItemSortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'type-asc';
type CollectionSortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

interface FavoriteItem {
  id: string;
  title: string;
  updatedAt: Date;
  itemType: {
    name: string;
    icon: string;
    color: string;
  };
}

interface FavoriteCollection {
  id: string;
  name: string;
  updatedAt: Date;
  itemCount: number;
  accentColor: string;
}

interface Props {
  items: FavoriteItem[];
  collections: FavoriteCollection[];
}

function ItemSortSelect({
  value,
  onChange,
}: {
  value: ItemSortKey;
  onChange: (v: ItemSortKey) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ItemSortKey)}>
      <SelectTrigger className='h-6 w-36 text-[10px] font-mono border-border/50 bg-transparent focus:ring-0'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='date-desc' className='text-xs font-mono'>
          Date: Recent
        </SelectItem>
        <SelectItem value='date-asc' className='text-xs font-mono'>
          Date: Oldest
        </SelectItem>
        <SelectItem value='name-asc' className='text-xs font-mono'>
          Name: A → Z
        </SelectItem>
        <SelectItem value='name-desc' className='text-xs font-mono'>
          Name: Z → A
        </SelectItem>
        <SelectItem value='type-asc' className='text-xs font-mono'>
          Type: A → Z
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function CollectionSortSelect({
  value,
  onChange,
}: {
  value: CollectionSortKey;
  onChange: (v: CollectionSortKey) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CollectionSortKey)}>
      <SelectTrigger className='h-6 w-36 text-[10px] font-mono border-border/50 bg-transparent focus:ring-0'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='date-desc' className='text-xs font-mono'>
          Date: Recent
        </SelectItem>
        <SelectItem value='date-asc' className='text-xs font-mono'>
          Date: Oldest
        </SelectItem>
        <SelectItem value='name-asc' className='text-xs font-mono'>
          Name: A → Z
        </SelectItem>
        <SelectItem value='name-desc' className='text-xs font-mono'>
          Name: Z → A
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function FavoritesSortableList({ items, collections }: Props) {
  const [itemSort, setItemSort] = useState<ItemSortKey>('date-desc');
  const [collectionSort, setCollectionSort] = useState<CollectionSortKey>('date-desc');

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      switch (itemSort) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'type-asc':
          return a.itemType.name.localeCompare(b.itemType.name);
        case 'date-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'date-desc':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [items, itemSort]);

  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => {
      switch (collectionSort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'date-desc':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [collections, collectionSort]);

  return (
    <>
      {items.length > 0 && (
        <section>
          <div className='flex items-center gap-2 mb-1 px-3'>
            <span className='text-xs font-mono text-muted-foreground uppercase tracking-widest'>
              Items
            </span>
            <span className='text-xs font-mono text-muted-foreground/50'>{items.length}</span>
            <div className='ml-auto'>
              <ItemSortSelect value={itemSort} onChange={setItemSort} />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            {sortedItems.map((item) => (
              <FavoriteItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {collections.length > 0 && (
        <section>
          <div className='flex items-center gap-2 mb-1 px-3'>
            <span className='text-xs font-mono text-muted-foreground uppercase tracking-widest'>
              Collections
            </span>
            <span className='text-xs font-mono text-muted-foreground/50'>{collections.length}</span>
            <div className='ml-auto'>
              <CollectionSortSelect value={collectionSort} onChange={setCollectionSort} />
            </div>
          </div>
          <div className='border border-border rounded-md overflow-hidden divide-y divide-border/50'>
            {sortedCollections.map((col) => (
              <FavoriteCollectionRow key={col.id} collection={col} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
