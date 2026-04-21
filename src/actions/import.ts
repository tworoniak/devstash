'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ExportSchema, type ImportSummary } from '@/lib/import-schema';

const FREE_ITEM_LIMIT = 50;
const FREE_COLLECTION_LIMIT = 3;

const FILE_TYPES = new Set(['file', 'image']);
const URL_TYPES = new Set(['link']);

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function parseExportJson(jsonString: string): ActionResult<z.infer<typeof ExportSchema>> {
  let raw: unknown;
  try {
    raw = JSON.parse(jsonString);
  } catch {
    return { success: false, error: 'Invalid JSON file' };
  }

  const result = ExportSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: 'File format is not a valid DevStash export' };
  }

  return { success: true, data: result.data };
}

export async function previewImport(jsonString: string): Promise<ActionResult<ImportSummary>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const parsed = parseExportJson(jsonString);
  if (!parsed.success) return parsed;

  const { items, collections } = parsed.data;
  const itemsByType: Record<string, number> = {};
  const allTags = new Set<string>();

  for (const item of items) {
    itemsByType[item.type] = (itemsByType[item.type] ?? 0) + 1;
    for (const tag of item.tags) allTags.add(tag);
  }

  return {
    success: true,
    data: {
      itemsByType,
      collectionCount: collections.length,
      tagCount: allTags.size,
    },
  };
}

export async function importData(
  jsonString: string,
  skipDuplicates: boolean
): Promise<ActionResult<{ itemsImported: number; collectionsImported: number }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };
  const userId = session.user.id;

  const parsed = parseExportJson(jsonString);
  if (!parsed.success) return parsed;

  const { items: allItems, collections: exportCollections } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true },
  });
  const isPro = user?.isPro ?? false;

  // Free users: skip file/image items
  const items = isPro ? allItems : allItems.filter((item) => !FILE_TYPES.has(item.type));

  // Free tier limit checks
  if (!isPro) {
    const [currentItemCount, currentCollectionCount] = await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
    ]);

    const availableItems = FREE_ITEM_LIMIT - currentItemCount;
    if (items.length > availableItems) {
      return {
        success: false,
        error:
          availableItems <= 0
            ? 'Free tier item limit reached (50 items). Upgrade to Pro to import more.'
            : `This import would exceed your free tier limit of 50 items. You have ${availableItems} slot${availableItems === 1 ? '' : 's'} available.`,
      };
    }

    const availableCollections = FREE_COLLECTION_LIMIT - currentCollectionCount;
    if (exportCollections.length > availableCollections) {
      return {
        success: false,
        error:
          availableCollections <= 0
            ? 'Free tier collection limit reached (3 collections). Upgrade to Pro to import more.'
            : `This import would exceed your free tier limit of 3 collections. You have ${availableCollections} slot${availableCollections === 1 ? '' : 's'} available.`,
      };
    }
  }

  // Get all system item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: { id: true, name: true },
  });
  const typeMap = new Map(itemTypes.map((t) => [t.name, t.id]));

  // Fetch existing items for duplicate detection
  let existingItems: { title: string; itemType: { name: string }; content: string | null; url: string | null }[] = [];
  if (skipDuplicates) {
    existingItems = await prisma.item.findMany({
      where: { userId },
      select: {
        title: true,
        content: true,
        url: true,
        itemType: { select: { name: true } },
      },
    });
  }

  function isDuplicate(item: (typeof items)[0]): boolean {
    return existingItems.some(
      (existing) =>
        existing.title === item.title &&
        existing.itemType.name === item.type &&
        existing.content === (item.content ?? null) &&
        existing.url === (item.url ?? null)
    );
  }

  const itemsToImport = skipDuplicates ? items.filter((item) => !isDuplicate(item)) : items;

  let itemsImported = 0;
  let collectionsImported = 0;

  await prisma.$transaction(async (tx) => {
    // 1. Upsert collections by name
    const collectionMap = new Map<string, string>();

    const allCollectionNames = new Set<string>([
      ...exportCollections.map((c) => c.name),
      ...itemsToImport.flatMap((item) => item.collections),
    ]);

    for (const name of allCollectionNames) {
      const existing = await tx.collection.findFirst({
        where: { userId, name },
        select: { id: true },
      });
      if (existing) {
        collectionMap.set(name, existing.id);
      } else {
        const exportedCol = exportCollections.find((c) => c.name === name);
        const created = await tx.collection.create({
          data: {
            name,
            description: exportedCol?.description ?? null,
            isFavorite: exportedCol?.isFavorite ?? false,
            userId,
          },
          select: { id: true },
        });
        collectionMap.set(name, created.id);
        // Only count collections that were in the original export
        if (exportedCol) collectionsImported++;
      }
    }

    // 2. Create items with tags and collection assignments
    for (const item of itemsToImport) {
      const typeId = typeMap.get(item.type);
      if (!typeId) continue;

      let contentType: 'TEXT' | 'FILE' | 'URL' = 'TEXT';
      if (URL_TYPES.has(item.type)) contentType = 'URL';
      else if (FILE_TYPES.has(item.type)) contentType = 'FILE';

      const created = await tx.item.create({
        data: {
          title: item.title,
          contentType,
          content: item.content ?? null,
          language: item.language ?? null,
          description: item.description ?? null,
          url: item.url ?? null,
          fileName: item.fileName ?? null,
          fileSize: item.fileSize ?? null,
          isFavorite: item.isFavorite,
          isPinned: item.isPinned,
          userId,
          itemTypeId: typeId,
          tags: {
            connectOrCreate: item.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        select: { id: true },
      });

      for (const colName of item.collections) {
        const colId = collectionMap.get(colName);
        if (colId) {
          await tx.itemCollection.create({
            data: { itemId: created.id, collectionId: colId },
          });
        }
      }

      itemsImported++;
    }
  });

  return { success: true, data: { itemsImported, collectionsImported } };
}
