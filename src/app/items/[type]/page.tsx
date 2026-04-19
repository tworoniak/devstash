import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getItemsByType } from '@/lib/db/items';
import { ItemRow } from '@/components/dashboard/item-row';
import { ImageThumbnailCard } from '@/components/items/image-thumbnail-card';
import { FileListRow } from '@/components/items/file-list-row';

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
}

export default async function ItemsTypePage({ params }: PageProps) {
  const { type: slug } = await params;

  const typeName = SLUG_TO_TYPE[slug];
  if (!typeName) {
    notFound();
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const items = await getItemsByType(session.user.id, typeName);

  const displayName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>{displayName}</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          {items.length} {items.length === 1 ? typeName : slug}
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
    </div>
  );
}
