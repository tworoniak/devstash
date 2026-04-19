'use client';

import { Search, Plus, FolderPlus, Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { MobileSidebarContent } from '@/components/layout/sidebar';
import type { SidebarData, SidebarUser } from '@/components/layout/sidebar';

interface TopBarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
  onNewItem: () => void;
}

export function TopBar({ sidebarOpen, onSidebarToggle, sidebarData, user, onNewItem }: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className='h-14 border-b border-border bg-background flex items-center gap-3 px-4 shrink-0'>
        {/* Mobile menu button */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-muted-foreground'
          onClick={() => setMobileOpen(true)}
          aria-label='Open menu'
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Logo */}
        <div className='flex items-center gap-2 shrink-0'>
          <div className='w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold'>
            DS
          </div>
          <span className='font-semibold text-sm hidden sm:block'>
            DevStash
          </span>
        </div>

        {/* Sidebar toggle — desktop only */}
        <Button
          variant='ghost'
          size='icon'
          className='hidden lg:flex text-muted-foreground hover:text-foreground'
          onClick={onSidebarToggle}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <PanelLeft className='h-4 w-4' />
        </Button>

        {/* Search */}
        <div className='flex-1 max-w-xl relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search items...'
            className='pl-9 bg-muted/30 border-border text-sm h-9'
            readOnly
          />
          <kbd className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded border border-border hidden sm:block'>
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 ml-auto shrink-0'>
          <Button
            variant='outline'
            size='sm'
            className='gap-1.5 text-sm hidden sm:flex border-border'
          >
            <FolderPlus className='h-4 w-4' />
            New Collection
          </Button>
          <Button size='sm' className='gap-1.5 text-sm' onClick={onNewItem}>
            <Plus className='h-4 w-4' />
            <span className='hidden sm:inline'>New Item</span>
          </Button>
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side='left'
          className='w-64 pl-0 pr-0 pb-0 pt-10 bg-background border-r border-border'
        >
          <SheetTitle className='sr-only'>Navigation</SheetTitle>
          <MobileSidebarContent sidebarData={sidebarData} user={user} />
        </SheetContent>
      </Sheet>
    </>
  );
}
