'use client';

import Link from 'next/link';
import {
  Code,
  Star,
  Folder,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { ICON_MAP } from '@/lib/constants/icon-map';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/shared/user-avatar';
import { signOut } from 'next-auth/react';
import type { SidebarItemType } from '@/lib/db/items';
import type { SidebarCollection } from '@/lib/db/collections';

export interface SidebarData {
  itemTypes: SidebarItemType[];
  favoriteCollections: SidebarCollection[];
  recentCollections: SidebarCollection[];
}

export interface SidebarUser {
  name: string | null;
  email: string | null;
  image: string | null;
}

const PRO_TYPES = ['file', 'image'];

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
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
}

export function SidebarContent({ collapsed = false, sidebarData, user }: SidebarContentProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const itemTypes = sidebarData?.itemTypes ?? [];
  const favoriteCollections = sidebarData?.favoriteCollections ?? [];
  const recentCollections = sidebarData?.recentCollections ?? [];

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
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? Code;
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
                          {type.count}
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
                {favoriteCollections.length > 0 && (
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
                )}

                {/* Recent collections */}
                {recentCollections.length > 0 && (
                  <div>
                    <p className='px-3 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60'>
                      Recent
                    </p>
                    <nav className='px-1.5 space-y-0.5'>
                      {recentCollections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className='flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                        >
                          <Folder className='h-3.5 w-3.5 shrink-0 text-muted-foreground/50' />
                          <span className='flex-1 truncate'>{col.name}</span>
                          <span
                            className='h-2 w-2 rounded-full shrink-0'
                            style={{ backgroundColor: col.accentColor }}
                          />
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}

                {/* View all collections */}
                <Link
                  href='/collections'
                  className='flex items-center gap-1.5 px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
                >
                  <ChevronRight className='h-3 w-3' />
                  View all collections
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* User area */}
      <div className='shrink-0 border-t border-border p-2'>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <UserAvatar
              name={user?.name}
              image={user?.image}
              size={28}
              className='shrink-0'
            />
            {!collapsed && user && (
              <div className='flex-1 min-w-0 text-left'>
                <p className='text-xs font-medium text-foreground truncate'>
                  {user.name}
                </p>
                <p className='text-[11px] text-muted-foreground truncate'>
                  {user.email}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side='top' align='start' className='w-48'>
            <DropdownMenuItem className='p-0'>
              <Link
                href='/profile'
                className='flex w-full items-center gap-2 px-1.5 py-1 cursor-pointer'
              >
                <User className='h-4 w-4' />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer'
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
            >
              <LogOut className='h-4 w-4' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar({
  open,
  sidebarData,
  user,
}: {
  open: boolean;
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
}) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-200 ${
        open ? 'w-56' : 'w-14'
      }`}
    >
      <SidebarContent collapsed={!open} sidebarData={sidebarData} user={user} />
    </aside>
  );
}

export function MobileSidebarContent({
  sidebarData,
  user,
}: {
  sidebarData: SidebarData | null;
  user: SidebarUser | null;
}) {
  return <SidebarContent collapsed={false} sidebarData={sidebarData} user={user} />;
}
