'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { useItemDrawer } from '@/components/items/item-drawer-provider';
import type { SearchData } from '@/app/api/search/route';

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const router = useRouter();
  const { openDrawer } = useItemDrawer();
  const [data, setData] = useState<SearchData | null>(null);

  useEffect(() => {
    fetch('/api/search')
      .then((res) => res.json())
      .then((json: SearchData) => setData(json))
      .catch(() => {});
  }, []);

  function handleSelectItem(itemId: string) {
    onOpenChange(false);
    openDrawer(itemId);
  }

  function handleSelectCollection(collectionId: string) {
    onOpenChange(false);
    router.push(`/collections/${collectionId}`);
  }

  const hasItems = (data?.items.length ?? 0) > 0;
  const hasCollections = (data?.collections.length ?? 0) > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Search'
      description='Search items and collections'
    >
      <Command>
      <CommandInput placeholder='Search items and collections...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {hasItems && (
          <CommandGroup heading='Items'>
            {data!.items.map((item) => {
              const Icon = ICON_MAP[item.typeIcon] ?? ICON_MAP['File'];
              return (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelectItem(item.id)}
                >
                  <Icon className='shrink-0' style={{ color: item.typeColor }} />
                  <span>{item.title}</span>
                  <span className='ml-auto text-xs text-muted-foreground capitalize'>
                    {item.typeName}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {hasItems && hasCollections && <CommandSeparator />}

        {hasCollections && (
          <CommandGroup heading='Collections'>
            {data!.collections.map((col) => (
              <CommandItem
                key={col.id}
                value={col.name}
                onSelect={() => handleSelectCollection(col.id)}
              >
                <FolderOpen className='shrink-0 text-muted-foreground' />
                <span>{col.name}</span>
                <span className='ml-auto text-xs text-muted-foreground'>
                  {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  );
}
