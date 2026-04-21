import { describe, it, expect } from 'vitest';
import { ExportSchema } from '@/lib/import-schema';

const validExport = {
  version: 1 as const,
  exportedAt: '2026-01-01T00:00:00.000Z',
  items: [
    {
      title: 'useAuth hook',
      type: 'snippet',
      content: 'export function useAuth() {}',
      language: 'typescript',
      description: 'Custom auth hook',
      url: null,
      fileName: null,
      fileSize: null,
      tags: ['react', 'auth'],
      collections: ['React Patterns'],
      isFavorite: true,
      isPinned: false,
    },
    {
      title: 'Google search',
      type: 'link',
      content: null,
      language: null,
      description: null,
      url: 'https://google.com',
      fileName: null,
      fileSize: null,
      tags: [],
      collections: [],
      isFavorite: false,
      isPinned: false,
    },
  ],
  collections: [
    {
      name: 'React Patterns',
      description: 'Common React patterns',
      isFavorite: false,
    },
  ],
};

describe('ExportSchema', () => {
  it('validates a well-formed export', () => {
    const result = ExportSchema.safeParse(validExport);
    expect(result.success).toBe(true);
  });

  it('rejects wrong version', () => {
    const result = ExportSchema.safeParse({ ...validExport, version: 2 });
    expect(result.success).toBe(false);
  });

  it('rejects missing items array', () => {
    const { items: _items, ...rest } = validExport;
    const result = ExportSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects item with empty title', () => {
    const bad = {
      ...validExport,
      items: [{ ...validExport.items[0], title: '' }],
    };
    const result = ExportSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it('applies defaults for missing optional arrays', () => {
    const minimal = {
      version: 1 as const,
      items: [{ title: 'Test', type: 'snippet' }],
      collections: [],
    };
    const result = ExportSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items[0].tags).toEqual([]);
      expect(result.data.items[0].collections).toEqual([]);
      expect(result.data.items[0].isFavorite).toBe(false);
      expect(result.data.items[0].isPinned).toBe(false);
    }
  });

  it('rejects collection with empty name', () => {
    const bad = {
      ...validExport,
      collections: [{ name: '', isFavorite: false }],
    };
    const result = ExportSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it('parses items without exportedAt', () => {
    const { exportedAt: _exportedAt, ...rest } = validExport;
    const result = ExportSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });
});
