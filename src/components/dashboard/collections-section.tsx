import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';
import { auth } from '@/auth';
import { getDashboardCollections } from '@/lib/db/collections';
import { CollectionCard } from './collection-card';

export async function CollectionsSection() {
  let collections: Awaited<ReturnType<typeof getDashboardCollections>> = [];

  try {
    const session = await auth();
    if (session?.user?.id) {
      collections = await getDashboardCollections(session.user.id);
    }
  } catch (err) {
    console.error('Failed to load collections:', err);
    return (
      <section className='mb-8'>
        <h2 className='text-sm font-semibold text-foreground mb-3'>
          Collections
        </h2>
        <p className='text-sm text-muted-foreground'>
          Failed to load collections.
        </p>
      </section>
    );
  }

  return (
    <section className='mb-8'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2 mb-2'>
          <Layers className='h-3.5 w-3.5 text-muted-foreground' />
          <h2 className='text-sm font-semibold text-foreground'>Collections</h2>
          <p className='text-xs text-muted-foreground'>
            {collections.length}{' '}
            {collections.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        <Link
          href='/collections'
          className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
        >
          View all
          <ChevronRight className='h-3 w-3' />
        </Link>
      </div>
      {collections.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No collections yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </section>
  );
}
