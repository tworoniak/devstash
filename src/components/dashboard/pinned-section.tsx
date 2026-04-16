import { Pin } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import { ItemRow } from './item-row';

const pinnedItems = mockItems.filter((item) => item.isPinned);

export function PinnedSection() {
  if (pinnedItems.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Pin className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
        <h2 className="text-sm font-semibold text-foreground">Pinned</h2>
      </div>
      <div className="flex flex-col gap-1">
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
