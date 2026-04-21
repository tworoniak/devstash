'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { NewCollectionDialog } from './new-collection-dialog';

export function NewCollectionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
      >
        <FolderPlus className='h-3.5 w-3.5' />
        New collection
      </button>
      <NewCollectionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
