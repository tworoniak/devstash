'use client';

import { useCallback, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAC_DOTS = [
  { color: '#ff5f57', label: 'close' },
  { color: '#ffbd2e', label: 'minimize' },
  { color: '#28c840', label: 'maximize' },
];

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;
const LINE_HEIGHT = 20;
const HEADER_HEIGHT = 36;

function computeEditorHeight(value: string): number {
  const lines = value.split('\n').length;
  return Math.min(Math.max(lines * LINE_HEIGHT, MIN_HEIGHT), MAX_HEIGHT);
}

interface CodeEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function CodeEditor({ value, language, readOnly = false, onChange }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [editorHeight, setEditorHeight] = useState(() => computeEditorHeight(value));

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      const v = newValue ?? '';
      setEditorHeight(computeEditorHeight(v));
      onChange?.(v);
    },
    [onChange],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const displayLanguage = language?.toLowerCase() || 'plaintext';

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 bg-[#1e1e1e]"
        style={{ height: HEADER_HEIGHT }}
      >
        {/* macOS dots */}
        <div className="flex items-center gap-1.5">
          {MAC_DOTS.map((dot) => (
            <span
              key={dot.label}
              aria-label={dot.label}
              className="block h-3 w-3 rounded-full"
              style={{ backgroundColor: dot.color }}
            />
          ))}
        </div>

        {/* Language + copy */}
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-[11px] text-[#858585] font-mono select-none">
              {displayLanguage}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-[#858585] hover:text-white hover:bg-white/10"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ height: editorHeight }}>
        <Editor
          value={value}
          language={displayLanguage}
          theme="vs-dark"
          onChange={readOnly ? undefined : handleChange}
          options={{
            readOnly,
            fontSize: 13,
            lineHeight: LINE_HEIGHT,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            folding: false,
            lineNumbers: 'on',
            renderLineHighlight: readOnly ? 'none' : 'line',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'hidden',
              verticalScrollbarSize: 6,
              useShadows: false,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
