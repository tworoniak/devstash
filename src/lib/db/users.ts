import { prisma } from '@/lib/prisma';
import type { EditorPreferences } from '@/lib/editor-preferences';
import { DEFAULT_EDITOR_PREFERENCES } from '@/lib/editor-preferences';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  hasPassword: boolean;
  createdAt: Date;
}

export interface ProfileItemTypeStat {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface ProfileStats {
  totalItems: number;
  totalCollections: number;
  itemTypeCounts: ProfileItemTypeStat[];
}

export async function getEditorPreferences(userId: string): Promise<EditorPreferences> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { editorPreferences: true },
  });
  if (!user?.editorPreferences) return DEFAULT_EDITOR_PREFERENCES;
  const raw = user.editorPreferences as Record<string, unknown>;
  return {
    fontSize: typeof raw.fontSize === 'number' ? raw.fontSize : DEFAULT_EDITOR_PREFERENCES.fontSize,
    tabSize: typeof raw.tabSize === 'number' ? raw.tabSize : DEFAULT_EDITOR_PREFERENCES.tabSize,
    wordWrap: typeof raw.wordWrap === 'boolean' ? raw.wordWrap : DEFAULT_EDITOR_PREFERENCES.wordWrap,
    minimap: typeof raw.minimap === 'boolean' ? raw.minimap : DEFAULT_EDITOR_PREFERENCES.minimap,
    theme: (raw.theme === 'vs-dark' || raw.theme === 'monokai' || raw.theme === 'github-dark')
      ? raw.theme
      : DEFAULT_EDITOR_PREFERENCES.theme,
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: !!user.password,
    createdAt: user.createdAt,
  };
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: {
        _count: {
          select: { items: { where: { userId } } },
        },
      },
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    itemTypeCounts: itemTypes.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    })),
  };
}
