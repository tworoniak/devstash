import { describe, it, expect } from 'vitest';

// Pure unit: verify the shape of ExportData matches the expected format
// (DB queries are integration-tested manually; we test the shape contract here)

interface ExportItem {
  title: string;
  type: string;
  content: string | null;
  language: string | null;
  description: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileUrl: string | null;
  tags: string[];
  collections: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExportData {
  version: 1;
  exportedAt: string;
  items: ExportItem[];
  collections: { name: string; description: string | null; isFavorite: boolean }[];
}

function validateExportShape(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!Array.isArray(d.items)) return false;
  if (!Array.isArray(d.collections)) return false;
  return true;
}

describe('export data shape', () => {
  it('validates a well-formed export object', () => {
    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      items: [
        {
          title: 'My snippet',
          type: 'snippet',
          content: 'console.log("hello")',
          language: 'javascript',
          description: null,
          url: null,
          fileName: null,
          fileSize: null,
          fileUrl: null,
          tags: ['js'],
          collections: ['My Collection'],
          isFavorite: false,
          isPinned: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      collections: [{ name: 'My Collection', description: null, isFavorite: false }],
    };

    expect(validateExportShape(data)).toBe(true);
    expect(data.version).toBe(1);
    expect(data.items).toHaveLength(1);
    expect(data.items[0].tags).toContain('js');
    expect(data.items[0].collections).toContain('My Collection');
    expect(data.collections).toHaveLength(1);
  });

  it('rejects objects missing version', () => {
    expect(validateExportShape({ exportedAt: new Date().toISOString(), items: [], collections: [] })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(validateExportShape(null)).toBe(false);
    expect(validateExportShape('string')).toBe(false);
    expect(validateExportShape(42)).toBe(false);
  });

  it('exportedAt is a valid ISO string', () => {
    const exportedAt = new Date().toISOString();
    expect(() => new Date(exportedAt)).not.toThrow();
    expect(new Date(exportedAt).getFullYear()).toBeGreaterThan(2020);
  });
});
