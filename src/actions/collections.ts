'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import {
  createCollection as createCollectionQuery,
  getUserCollections as getUserCollectionsQuery,
} from '@/lib/db/collections';
import type { CreatedCollection, UserCollection } from '@/lib/db/collections';

const CreateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().nullable().optional(),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createCollection(
  input: z.infer<typeof CreateCollectionSchema>
): Promise<ActionResult<CreatedCollection>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: message };
  }

  try {
    const created = await createCollectionQuery(session.user.id, {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    });
    return { success: true, data: created };
  } catch {
    return { success: false, error: 'Failed to create collection' };
  }
}

export async function getUserCollections(): Promise<ActionResult<UserCollection[]>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const collections = await getUserCollectionsQuery(session.user.id);
    return { success: true, data: collections };
  } catch {
    return { success: false, error: 'Failed to fetch collections' };
  }
}
