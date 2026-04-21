'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { EditorPreferencesSchema, type EditorPreferences } from '@/lib/editor-preferences';

export type { EditorPreferences };

export async function updateEditorPreferences(
  preferences: EditorPreferences
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = EditorPreferencesSchema.safeParse(preferences);
  if (!parsed.success) {
    return { success: false, error: 'Invalid preferences' };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { editorPreferences: parsed.data },
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save preferences' };
  }
}
