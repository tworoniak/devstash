'use client';

import { createContext, useContext, useState } from 'react';
import {
  type EditorPreferences,
  DEFAULT_EDITOR_PREFERENCES,
} from '@/lib/editor-preferences';

interface EditorPreferencesContextValue {
  preferences: EditorPreferences;
  setPreferences: (preferences: EditorPreferences) => void;
}

const EditorPreferencesContext = createContext<EditorPreferencesContextValue>({
  preferences: DEFAULT_EDITOR_PREFERENCES,
  setPreferences: () => {},
});

export function EditorPreferencesProvider({
  children,
  initialPreferences,
}: {
  children: React.ReactNode;
  initialPreferences?: EditorPreferences | null;
}) {
  const [preferences, setPreferences] = useState<EditorPreferences>(
    initialPreferences ?? DEFAULT_EDITOR_PREFERENCES
  );

  return (
    <EditorPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}

export function useEditorPreferences() {
  return useContext(EditorPreferencesContext);
}
