import ScrollFadeIn from './ScrollFadeIn';

const CHECKLIST = [
  'AI tag suggestions based on content',
  'Automatic summaries for long snippets',
  '"Explain This Code" for any snippet',
  'Prompt optimizer for better AI results',
];

const CODE_LINES = [
  { ln: '1', parts: [{ t: 'kw', v: 'import' }, { t: 'id', v: ' { useSession } ' }, { t: 'kw', v: 'from' }, { t: 'str', v: " 'next-auth/react'" }] },
  { ln: '2', parts: [] },
  { ln: '3', parts: [{ t: 'kw', v: 'export function ' }, { t: 'fn', v: 'useAuth' }, { t: 'id', v: '() {' }] },
  { ln: '4', parts: [{ t: 'sp', v: '  ' }, { t: 'kw', v: 'const ' }, { t: 'id', v: '{ data: session, status } = ' }, { t: 'fn', v: 'useSession' }, { t: 'id', v: '()' }] },
  { ln: '5', parts: [{ t: 'sp', v: '  ' }, { t: 'kw', v: 'return ' }, { t: 'id', v: '{' }] },
  { ln: '6', parts: [{ t: 'sp', v: '    ' }, { t: 'id', v: 'user: session?.user,' }] },
  { ln: '7', parts: [{ t: 'sp', v: '    ' }, { t: 'id', v: 'isLoading: status === ' }, { t: 'str', v: "'loading'" }, { t: 'id', v: ',' }] },
  { ln: '8', parts: [{ t: 'sp', v: '    ' }, { t: 'id', v: 'isAuth: status === ' }, { t: 'str', v: "'authenticated'" }] },
  { ln: '9', parts: [{ t: 'sp', v: '  ' }, { t: 'id', v: '}' }] },
  { ln: '10', parts: [{ t: 'id', v: '}' }] },
];

const COLOR_MAP: Record<string, string> = {
  kw: '#ff7b72',
  fn: '#d2a8ff',
  str: '#a5d6ff',
  id: '#c9d1d9',
  sp: 'transparent',
};

const TAGS = ['next-auth', 'react', 'hooks', 'auth', 'session'];

export default function AISection() {
  return (
    <section
      id="ai"
      className="py-24 border-t border-b border-white/[0.07]"
      style={{ background: '#111114' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <ScrollFadeIn>
            <span className="inline-block text-[0.7rem] font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2.5 py-0.5 rounded-full mb-4">
              Pro Feature
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.2] mb-3">
              AI-Powered{' '}
              <br />
              <span className="bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>
            <p className="text-white/50 mb-7">Let AI do the busywork so you can focus on building.</p>
            <ul className="flex flex-col gap-3.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    className="w-4 h-4 shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollFadeIn>

          {/* Right code editor mockup */}
          <ScrollFadeIn delay={150}>
            <div
              className="rounded-xl overflow-hidden border border-white/[0.12]"
              style={{ background: '#0d1117', fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/[0.06]"
                style={{ background: '#161b22' }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
                </div>
                <span className="text-[0.72rem] text-white/25">useAuth.ts — Snippet</span>
              </div>

              {/* Code body */}
              <div className="py-3.5 text-[0.75rem] leading-[1.8]">
                {CODE_LINES.map((line) => (
                  <div key={line.ln} className="flex items-baseline gap-3 px-4">
                    <span className="text-[0.68rem] text-white/20 select-none min-w-[12px]">
                      {line.ln}
                    </span>
                    <span>
                      {line.parts.map((p, i) => (
                        <span key={i} style={{ color: COLOR_MAP[p.t] ?? '#c9d1d9' }}>
                          {p.v}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div
                className="px-4 py-3 border-t border-white/[0.06]"
                style={{ background: '#161b22' }}
              >
                <span className="block text-[0.65rem] text-white/25 uppercase tracking-widest mb-2">
                  AI Generated Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.7rem] px-2.5 py-0.5 rounded-full border"
                      style={{
                        background: 'rgba(99,102,241,0.15)',
                        borderColor: 'rgba(99,102,241,0.3)',
                        color: '#a5b4fc',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
