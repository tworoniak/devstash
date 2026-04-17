'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Sidebar } from '@/components/layout/sidebar';
import type { SidebarData } from '@/components/layout/sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarData: SidebarData | null;
}

export function DashboardShell({ children, sidebarData }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarData={sidebarData} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} sidebarData={sidebarData} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
