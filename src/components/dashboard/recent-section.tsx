import { Clock } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import { ItemRow } from './item-row';

const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

export function RecentSection() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Recent Items</h2>
      </div>
      <div className="flex flex-col gap-1">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
