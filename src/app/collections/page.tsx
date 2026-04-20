import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllCollections } from '@/lib/db/collections';
import { CollectionCard } from '@/components/dashboard/collection-card';
import { FolderOpen } from 'lucide-react';

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const collections = await getAllCollections(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
