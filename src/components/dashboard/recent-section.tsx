import { Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getDashboardRecentItems } from '@/lib/db/items';
import { ItemRow } from './item-row';

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function RecentSection() {
  let items: Awaited<ReturnType<typeof getDashboardRecentItems>> = [];

  try {
    const userId = await getDemoUserId();
    if (userId) {
      items = await getDashboardRecentItems(userId);
    }
  } catch (err) {
    console.error('Failed to load recent items:', err);
    return (
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Recent Items</h2>
        </div>
        <p className="text-sm text-muted-foreground">Failed to load recent items.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Recent Items</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
