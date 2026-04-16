import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getDashboardCollections } from '@/lib/db/collections';
import { CollectionCard } from './collection-card';

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function CollectionsSection() {
  const userId = await getDemoUserId();
  const collections = userId ? await getDashboardCollections(userId) : [];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Collections</h2>
        <Link
          href="/collections"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </section>
  );
}
