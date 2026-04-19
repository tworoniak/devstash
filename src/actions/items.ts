'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { r2Delete } from '@/lib/r2-api';
import {
  updateItem as updateItemQuery,
  deleteItem as deleteItemQuery,
  createItem as createItemQuery,
  toggleItemPin as toggleItemPinQuery,
  toggleItemFavorite as toggleItemFavoriteQuery,
} from '@/lib/db/items';
import type { ItemDetail, DashboardItem } from '@/lib/db/items';

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

const CREATE_ITEM_TYPES = ['snippet', 'prompt', 'command', 'note', 'link', 'file', 'image'] as const;

const CreateItemSchema = z
  .object({
    typeName: z.enum(CREATE_ITEM_TYPES),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().nullable().optional(),
    content: z.string().nullable().optional(),
    url: z.string().trim().nullable().optional(),
    language: z.string().trim().nullable().optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    fileKey: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    fileSize: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.typeName === 'link') {
      const parsed = z.string().url('Invalid URL').safeParse(data.url ?? '');
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A valid URL is required for links',
          path: ['url'],
        });
      }
    }
    if (data.typeName === 'file' || data.typeName === 'image') {
      if (!data.fileKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A file must be uploaded',
          path: ['fileKey'],
        });
      }
    }
  });

type CreateItemInput = z.infer<typeof CreateItemSchema>;

export async function createItem(input: CreateItemInput): Promise<ActionResult<DashboardItem>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateItemSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: message };
  }

  const { typeName, title, description, content, url, language, tags, fileKey, fileName, fileSize } =
    parsed.data;

  try {
    const created = await createItemQuery(session.user.id, {
      title,
      description: description ?? null,
      content: content ?? null,
      url: url ?? null,
      language: language ?? null,
      tags,
      typeName,
      fileKey: fileKey ?? null,
      fileName: fileName ?? null,
      fileSize: fileSize ?? null,
    });
    return { success: true, data: created };
  } catch {
    return { success: false, error: 'Failed to create item' };
  }
}

export async function toggleItemFavorite(itemId: string): Promise<ActionResult<{ isFavorite: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const result = await toggleItemFavoriteQuery(itemId, session.user.id);
    if (!result) {
      return { success: false, error: 'Item not found' };
    }
    return { success: true, data: result };
  } catch {
    return { success: false, error: 'Failed to update favorite' };
  }
}

export async function toggleItemPin(itemId: string): Promise<ActionResult<{ isPinned: boolean }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const result = await toggleItemPinQuery(itemId, session.user.id);
    if (!result) {
      return { success: false, error: 'Item not found' };
    }
    return { success: true, data: result };
  } catch {
    return { success: false, error: 'Failed to update pin' };
  }
}

export async function deleteItem(itemId: string): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const result = await deleteItemQuery(itemId, session.user.id);
    if (!result.deleted) {
      return { success: false, error: 'Item not found' };
    }

    if (result.fileKey) {
      try {
        await r2Delete(result.fileKey);
      } catch {
        // Non-fatal: DB row is gone, log and continue
        console.error('Failed to delete R2 object:', result.fileKey);
      }
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Failed to delete item' };
  }
}
