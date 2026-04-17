import { Box, Layers, Star, FolderOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getDashboardStats } from '@/lib/db/items';

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function StatsSection() {
  let totalItems = 0;
  let totalCollections = 0;
  let favoriteItems = 0;
  let favoriteCollections = 0;

  try {
    const userId = await getDemoUserId();
    if (userId) {
      ({ totalItems, totalCollections, favoriteItems, favoriteCollections } =
        await getDashboardStats(userId));
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }

  const stats = [
    { label: 'Total Items', value: totalItems, icon: Box, color: '#3b82f6' },
    { label: 'Collections', value: totalCollections, icon: Layers, color: '#8b5cf6' },
    { label: 'Favorite Items', value: favoriteItems, icon: Star, color: '#f97316' },
    { label: 'Favorite Collections', value: favoriteCollections, icon: FolderOpen, color: '#10b981' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
          >
            <div
              className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stat.color}18` }}
            >
              <Icon className="h-4 w-4" style={{ color: stat.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-foreground leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
