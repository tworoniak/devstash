'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAC_DOTS = [
  { color: '#ff5f57', label: 'close' },
  { color: '#ffbd2e', label: 'minimize' },
  { color: '#28c840', label: 'maximize' },
];

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;
const LINE_HEIGHT = 22;
const HEADER_HEIGHT = 36;

function computeHeight(value: string): number {
  const lines = value.split('\n').length;
  return Math.min(Math.max(lines * LINE_HEIGHT, MIN_HEIGHT), MAX_HEIGHT);
}

interface MarkdownEditorProps {
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({ value, readOnly = false, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>(readOnly ? 'preview' : 'write');
  const [copied, setCopied] = useState(false);

  const contentHeight = computeHeight(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 bg-[#2d2d2d]"
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

        {/* Tabs + copy */}
        <div className="flex items-center gap-2">
          {!readOnly && (
            <div className="flex items-center rounded overflow-hidden border border-white/10">
              <button
                type="button"
                onClick={() => setTab('write')}
                className={`px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  tab === 'write'
                    ? 'bg-white/15 text-white'
                    : 'text-[#858585] hover:text-white hover:bg-white/10'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab('preview')}
                className={`px-2.5 py-0.5 text-[11px] font-medium transition-colors border-l border-white/10 ${
                  tab === 'preview'
                    ? 'bg-white/15 text-white'
                    : 'text-[#858585] hover:text-white hover:bg-white/10'
                }`}
              >
                Preview
              </button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-6 w-6 text-[#858585] hover:text-white hover:bg-white/10"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#1e1e1e]" style={{ height: contentHeight }}>
        {tab === 'write' && !readOnly ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="Write markdown…"
            className="w-full h-full bg-transparent text-sm text-[#d4d4d4] font-mono resize-none p-3 outline-none placeholder:text-[#6b7280]"
            style={{ height: contentHeight }}
          />
        ) : (
          <div
            className="markdown-preview prose prose-sm max-w-none h-full overflow-y-auto p-3"
            style={{ height: contentHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-[#6b7280] text-sm italic">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
