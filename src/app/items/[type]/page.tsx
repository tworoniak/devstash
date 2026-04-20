import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getItemsByType } from '@/lib/db/items';
import { ITEMS_PER_PAGE } from '@/lib/constants/pagination';
import { ItemRow } from '@/components/dashboard/item-row';
import { ImageThumbnailCard } from '@/components/items/image-thumbnail-card';
import { FileListRow } from '@/components/items/file-list-row';
import { Pagination } from '@/components/shared/pagination';

// Valid plural slugs → singular type names stored in DB
const SLUG_TO_TYPE: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  commands: 'command',
  notes: 'note',
  files: 'file',
  images: 'image',
  links: 'link',
};

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ItemsTypePage({ params, searchParams }: PageProps) {
  const { type: slug } = await params;
  const { page: pageParam } = await searchParams;

  const typeName = SLUG_TO_TYPE[slug];
  if (!typeName) {
    notFound();
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { items, total } = await getItemsByType(session.user.id, typeName, page);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const displayName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>{displayName}</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          {total} {total === 1 ? typeName : slug}
        </p>
      </div>

      {items.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-muted-foreground text-sm'>No {slug} yet.</p>
        </div>
      ) : slug === 'images' ? (
        <div className='grid grid-cols-3 gap-3'>
          {items.map((item) => (
            <ImageThumbnailCard key={item.id} item={item} />
          ))}
        </div>
      ) : slug === 'files' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {items.map((item) => (
            <FileListRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/items/${slug}`}
      />
    </div>
  );
}
