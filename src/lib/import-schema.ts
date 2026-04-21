import { z } from 'zod';

export const ExportItemSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  content: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  tags: z.array(z.string()).default([]),
  collections: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ExportCollectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  isFavorite: z.boolean().default(false),
});

export const ExportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().optional(),
  items: z.array(ExportItemSchema),
  collections: z.array(ExportCollectionSchema),
});

export type ExportSchemaType = z.infer<typeof ExportSchema>;

export type ImportSummary = {
  itemsByType: Record<string, number>;
  collectionCount: number;
  tagCount: number;
};
