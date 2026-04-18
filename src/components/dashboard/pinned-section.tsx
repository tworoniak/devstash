import { Pin } from 'lucide-react';
import { auth } from '@/auth';
import { getDashboardPinnedItems } from '@/lib/db/items';
import { ItemRow } from './item-row';

export async function PinnedSection() {
  let items: Awaited<ReturnType<typeof getDashboardPinnedItems>> = [];

  try {
    const session = await auth();
    if (session?.user?.id) {
      items = await getDashboardPinnedItems(session.user.id);
    }
  } catch (err) {
    console.error('Failed to load pinned items:', err);
    return null;
  }

  if (items.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Pin className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
        <h2 className="text-sm font-semibold text-foreground">Pinned</h2>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
