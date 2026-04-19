'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { updateItem as updateItemQuery } from '@/lib/db/items';
import type { ItemDetail } from '@/lib/db/items';

const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().trim().url('Invalid URL').nullable().optional(),
  language: z.string().trim().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<ActionResult<ItemDetail>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateItemSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: message };
  }

  const { title, description, content, url, language, tags } = parsed.data;

  try {
    const updated = await updateItemQuery(itemId, session.user.id, {
      title,
      description: description ?? null,
      content: content ?? null,
      url: url ?? null,
      language: language ?? null,
      tags,
    });

    if (!updated) {
      return { success: false, error: 'Item not found' };
    }

    return { success: true, data: updated };
  } catch {
    return { success: false, error: 'Failed to update item' };
  }
}
