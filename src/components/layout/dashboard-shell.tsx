'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Sidebar } from '@/components/layout/sidebar';
import { ItemDrawerProvider } from '@/components/items/item-drawer-provider';
import { NewItemDialog } from '@/components/items/new-item-dialog';
import { SearchPalette } from '@/components/search/search-palette';
import { EditorPreferencesProvider } from '@/contexts/editor-preferences-context';
import type { SidebarData, SidebarUser } from '@/components/layout/sidebar';
import type { EditorPreferences } from '@/lib/editor-preferences';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
  initialEditorPreferences?: EditorPreferences | null;
}

export function DashboardShell({ children, sidebarData, user, initialEditorPreferences }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <EditorPreferencesProvider initialPreferences={initialEditorPreferences}>
      <ItemDrawerProvider>
        <div className='flex h-screen overflow-hidden'>
          <Sidebar open={sidebarOpen} sidebarData={sidebarData} user={user} />
          <div className='flex flex-col flex-1 overflow-hidden'>
            <TopBar
              sidebarOpen={sidebarOpen}
              onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
              sidebarData={sidebarData}
              user={user}
              onNewItem={() => setNewItemOpen(true)}
              onSearchOpen={() => setSearchOpen(true)}
            />
            <main className='flex-1 overflow-y-auto p-6'>{children}</main>
          </div>
          <NewItemDialog open={newItemOpen} onOpenChange={setNewItemOpen} />
          <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
      </ItemDrawerProvider>
    </EditorPreferencesProvider>
  );
}
