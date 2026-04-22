'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewItemDialog, type ItemTypeName } from './new-item-dialog';

interface NewTypeItemButtonProps {
  typeName: ItemTypeName;
  label: string;
}

export function NewTypeItemButton({ typeName, label }: NewTypeItemButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size='sm'
        className='gap-1.5 text-sm bg-linear-to-r from-blue-500 to-violet-500 text-white hover:from-violet-500 hover:to-blue-500 transition-all border-0'
        onClick={() => setOpen(true)}
      >
        <Plus className='h-4 w-4' />
        New {label}
      </Button>
      <NewItemDialog open={open} onOpenChange={setOpen} defaultType={typeName} />
    </>
  );
}
