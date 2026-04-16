'use client';

import Link from 'next/link';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Folder,
  ChevronDown,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  mockUser,
  mockItemTypes,
  mockCollections,
  mockItemTypeCounts,
} from '@/lib/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

const PRO_TYPES = ['file', 'image'];

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const allCollections = mockCollections.filter((c) => !c.isFavorite);

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className='flex w-full items-center justify-between px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors'
    >
      <span>{label}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? '' : '-rotate-90'}`}
      />
    </button>
  );
}

interface SidebarContentProps {
  collapsed?: boolean;
}

export function SidebarContent({ collapsed = false }: SidebarContentProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1'>
        {/* Types section */}
        {!collapsed && (
          <SectionHeader
            label='Types'
            open={typesOpen}
            onToggle={() => setTypesOpen(!typesOpen)}
          />
        )}
        {(typesOpen || collapsed) && (
          <nav
            className={`space-y-0.5 mb-4 pb-4 border-b border-border ${collapsed ? 'px-1' : 'px-1.5'}`}
          >
            {mockItemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? Code;
              const count =
                mockItemTypeCounts[
                  type.name as keyof typeof mockItemTypeCounts
                ] ?? 0;
              const isPro = PRO_TYPES.includes(type.name);

              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name}s`}
                  title={collapsed ? `${type.name}s` : undefined}
                  className={`flex items-center gap-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${
                    collapsed ? 'justify-center px-2 py-2' : 'px-2 py-1.5'
                  }`}
                >
                  <Icon
                    className='h-4 w-4 shrink-0'
                    style={{ color: type.color }}
                  />
                  {!collapsed && (
                    <>
                      <span className='flex-1 capitalize'>{type.name}s</span>
                      {isPro ? (
                        <Badge
                          variant='outline'
                          className='text-[9px] px-1 py-0 h-4 border-amber-500/50 text-amber-500'
                        >
                          PRO
                        </Badge>
                      ) : (
                        <span className='text-xs text-muted-foreground/60'>
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Collections — hidden when collapsed */}
        {!collapsed && (
          <>
            <SectionHeader
              label='Collections'
              open={collectionsOpen}
              onToggle={() => setCollectionsOpen(!collectionsOpen)}
            />
            {collectionsOpen && (
              <div className='space-y-3 mb-2'>
                {/* Favorites */}
                <div>
                  <p className='px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'>
                    Favorites
                  </p>
                  <nav className='px-1.5 space-y-0.5'>
                    {favoriteCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className='flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                      >
                        <Folder className='h-3.5 w-3.5 shrink-0 text-muted-foreground/50' />
                        <span className='flex-1 truncate'>{col.name}</span>
                        <Star className='h-3 w-3 shrink-0 fill-amber-400 text-amber-400' />
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* All collections */}
                <div>
                  <p className='px-3 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'>
                    All Collections
                  </p>
                  <nav className='px-1.5 space-y-0.5'>
                    {allCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className='flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                      >
                        <Folder className='h-3.5 w-3.5 shrink-0 text-muted-foreground/50' />
                        <span className='flex-1 truncate'>{col.name}</span>
                        <span className='text-xs text-muted-foreground/60'>
                          {col.itemCount}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User area */}
      <div className='shrink-0 border-t border-border p-2'>
        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Avatar className='h-7 w-7 shrink-0'>
            <AvatarFallback className='text-[11px] bg-blue-600 text-white'>
              {getInitials(mockUser.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-foreground truncate'>
                  {mockUser.name}
                </p>
                <p className='text-[11px] text-muted-foreground truncate'>
                  {mockUser.email}
                </p>
              </div>
              <Settings className='h-4 w-4 text-muted-foreground shrink-0' />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-200 ${
        open ? 'w-56' : 'w-14'
      }`}
    >
      <SidebarContent collapsed={!open} />
    </aside>
  );
}

export function MobileSidebarContent() {
  return <SidebarContent collapsed={false} />;
}
