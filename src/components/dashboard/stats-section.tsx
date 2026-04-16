import { Box, Layers, Star, FolderOpen } from 'lucide-react';
import { mockCollections, mockItems, mockItemTypeCounts } from '@/lib/mock-data';

const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
const totalCollections = mockCollections.length;
const favoriteItems = mockItems.filter((i) => i.isFavorite).length;
const favoriteCollections = mockCollections.filter((c) => c.isFavorite).length;

const stats = [
  { label: 'Total Items', value: totalItems, icon: Box, color: '#3b82f6' },
  { label: 'Collections', value: totalCollections, icon: Layers, color: '#8b5cf6' },
  { label: 'Favorite Items', value: favoriteItems, icon: Star, color: '#f97316' },
  { label: 'Favorite Collections', value: favoriteCollections, icon: FolderOpen, color: '#10b981' },
];

export function StatsSection() {
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
