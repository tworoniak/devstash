import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFavoriteItems } from '@/lib/db/items';
import { getFavoriteCollections } from '@/lib/db/collections';
import { FavoritesSortableList } from '@/components/favorites/favorites-sortable-list';

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const [items, collections] = await Promise.all([
    getFavoriteItems(session.user.id),
    getFavoriteCollections(session.user.id),
  ]);

  const isEmpty = items.length === 0 && collections.length === 0;

  return (
    <div className='space-y-8 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Favorites</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          {items.length + collections.length} starred{' '}
          {items.length + collections.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      {isEmpty ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-muted-foreground text-sm'>No favorites yet.</p>
          <p className='text-muted-foreground/60 text-xs mt-1'>
            Star items or collections to find them here.
          </p>
        </div>
      ) : (
        <FavoritesSortableList items={items} collections={collections} />
      )}
    </div>
  );
}
