'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEditorPreferences } from '@/contexts/editor-preferences-context';
import { updateEditorPreferences } from '@/actions/editor-preferences';
import type { EditorPreferences } from '@/lib/editor-preferences';

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24];
const TAB_SIZES = [2, 4, 8];
const THEMES = [
  { value: 'vs-dark', label: 'VS Dark' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'github-dark', label: 'GitHub Dark' },
] as const;

export function EditorPreferencesForm() {
  const { preferences, setPreferences } = useEditorPreferences();
  const [isPending, startTransition] = useTransition();

  function save(updated: EditorPreferences) {
    setPreferences(updated);
    startTransition(async () => {
      const result = await updateEditorPreferences(updated);
      if (result.success) {
        toast.success('Editor preferences saved');
      } else {
        toast.error(result.error ?? 'Failed to save preferences');
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Theme</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Editor color theme</p>
        </div>
        <Select
          value={preferences.theme}
          onValueChange={(value) =>
            save({ ...preferences, theme: value as EditorPreferences['theme'] })
          }
          disabled={isPending}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Font Size</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Editor font size in pixels</p>
        </div>
        <Select
          value={String(preferences.fontSize)}
          onValueChange={(value) => save({ ...preferences, fontSize: Number(value) })}
          disabled={isPending}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab size */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Tab Size</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Number of spaces per tab</p>
        </div>
        <Select
          value={String(preferences.tabSize)}
          onValueChange={(value) => save({ ...preferences, tabSize: Number(value) })}
          disabled={isPending}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAB_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Word wrap */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Word Wrap</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Wrap long lines in the editor</p>
        </div>
        <Switch
          checked={preferences.wordWrap}
          onCheckedChange={(checked) => save({ ...preferences, wordWrap: checked })}
          disabled={isPending}
        />
      </div>

      {/* Minimap */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Minimap</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Show code minimap on the right</p>
        </div>
        <Switch
          checked={preferences.minimap}
          onCheckedChange={(checked) => save({ ...preferences, minimap: checked })}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
