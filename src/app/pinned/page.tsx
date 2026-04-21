import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getPinnedItems } from '@/lib/db/items';
import { FavoriteItemRow } from '@/components/favorites/favorite-item-row';

export default async function PinnedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const items = await getPinnedItems(session.user.id);

  return (
    <div className='space-y-8 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Pinned</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          {items.length} pinned {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-muted-foreground text-sm'>No pinned items yet.</p>
          <p className='text-muted-foreground/60 text-xs mt-1'>
            Pin items to keep them at the top and find them here.
          </p>
        </div>
      ) : (
        <section>
          <div className='flex items-center gap-2 mb-1 px-3'>
            <span className='text-xs font-mono text-muted-foreground uppercase tracking-widest'>
              Items
            </span>
            <span className='text-xs font-mono text-muted-foreground/50'>{items.length}</span>
          </div>
          <div className='flex flex-col gap-1'>
            {items.map((item) => (
              <FavoriteItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
