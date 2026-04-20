'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Sidebar } from '@/components/layout/sidebar';
import { ItemDrawerProvider } from '@/components/items/item-drawer-provider';
import { NewItemDialog } from '@/components/items/new-item-dialog';
import { NewCollectionDialog } from '@/components/collections/new-collection-dialog';
import type { SidebarData, SidebarUser } from '@/components/layout/sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
}

export function DashboardShell({ children, sidebarData, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <TopBar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarData={sidebarData}
        user={user}
        onNewItem={() => setNewItemOpen(true)}
        onNewCollection={() => setNewCollectionOpen(true)}
      />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar open={sidebarOpen} sidebarData={sidebarData} user={user} />
        <main className='flex-1 overflow-y-auto p-6'>
          <ItemDrawerProvider>{children}</ItemDrawerProvider>
        </main>
      </div>
      <NewItemDialog open={newItemOpen} onOpenChange={setNewItemOpen} />
      <NewCollectionDialog open={newCollectionOpen} onOpenChange={setNewCollectionOpen} />
    </div>
  );
}
