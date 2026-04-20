import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCollectionWithItems } from '@/lib/db/collections';
import { COLLECTIONS_PER_PAGE } from '@/lib/constants/pagination';
import { ItemRow } from '@/components/dashboard/item-row';
import { ImageThumbnailCard } from '@/components/items/image-thumbnail-card';
import { FileListRow } from '@/components/items/file-list-row';
import { Pagination } from '@/components/shared/pagination';
import { Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { collection, items, total } = await getCollectionWithItems(id, session.user.id, page);

  if (!collection) {
    notFound();
  }

  const totalPages = Math.ceil(total / COLLECTIONS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{collection.name}</h1>
          {collection.isFavorite && (
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
          )}
        </div>
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {total} {total === 1 ? 'item' : 'items'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">No items in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => {
            const typeName = item.itemType.icon;
            if (typeName === 'Image') {
              return <ImageThumbnailCard key={item.id} item={item} />;
            }
            if (typeName === 'File') {
              return <FileListRow key={item.id} item={item} />;
            }
            return <ItemRow key={item.id} item={item} />;
          })}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/collections/${id}`}
      />
    </div>
  );
}
