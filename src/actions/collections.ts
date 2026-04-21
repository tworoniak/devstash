'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import {
  createCollection as createCollectionQuery,
  getUserCollections as getUserCollectionsQuery,
  updateCollection as updateCollectionQuery,
  deleteCollection as deleteCollectionQuery,
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

const UpdateCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().nullable().optional(),
});

export async function updateCollection(
  input: z.infer<typeof UpdateCollectionSchema>
): Promise<ActionResult<CreatedCollection>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: message };
  }

  try {
    const updated = await updateCollectionQuery(parsed.data.id, session.user.id, {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    });
    if (!updated) return { success: false, error: 'Collection not found' };
    return { success: true, data: updated };
  } catch {
    return { success: false, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id: string): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const deleted = await deleteCollectionQuery(id, session.user.id);
    if (!deleted) return { success: false, error: 'Collection not found' };
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Failed to delete collection' };
  }
}
