'use client';

import {
  Search,
  Plus,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
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
  onSearchOpen: () => void;
}

export function TopBar({
  sidebarOpen,
  onSidebarToggle,
  sidebarData,
  user,
  onNewItem,
  onSearchOpen,
}: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className='h-14 border-b border-border bg-background relative flex items-center gap-3 px-4 shrink-0'>
        {/* Mobile menu button — hidden on desktop */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-muted-foreground'
          onClick={() => setMobileOpen(true)}
          aria-label='Open menu'
        >
          <Menu className='h-5 w-5' />
        </Button>

        {/* Sidebar collapse toggle — desktop only */}
        <div className='hidden lg:flex items-center justify-center -ml-4 self-stretch border-r border-border px-3 mr-1'>
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground h-10 w-10 rounded-none'
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={24} />
            ) : (
              <PanelLeftOpen size={24} />
            )}
          </Button>
        </div>

        {/* Search icon — mobile only */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-muted-foreground'
          aria-label='Search'
          onClick={onSearchOpen}
        >
          <Search className='h-5 w-5' />
        </Button>

        {/* Search — centered in header, desktop only */}
        <div className='hidden lg:block absolute left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none'>
          <div className='relative pointer-events-auto'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search items and collections... ⌘K'
              className='pl-9 bg-muted/30 border-border text-sm h-9 cursor-pointer'
              readOnly
              onClick={onSearchOpen}
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 ml-auto shrink-0 relative'>
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
          className='w-64 p-0 bg-sidebar-bg border-r border-border'
        >
          <SheetTitle className='sr-only'>Navigation</SheetTitle>
          <MobileSidebarContent sidebarData={sidebarData} user={user} />
        </SheetContent>
      </Sheet>
    </>
  );
}
