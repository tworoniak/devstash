import ScrollFadeIn from './ScrollFadeIn';

const FEATURES = [
  {
    accent: '#3b82f6',
    title: 'Code Snippets',
    description:
      'Save reusable code with syntax highlighting, language tags, and instant search. Never rewrite the same function twice.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    accent: '#f59e0b',
    title: 'AI Prompts',
    description:
      'Store your best prompts for ChatGPT, Claude, and other AI tools. Organise them and use them again with one click.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    accent: '#06b6d4',
    title: 'Instant Search',
    description:
      'Find anything across all your content in milliseconds. Search by title, tags, type, or full content.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    accent: '#22c55e',
    title: 'Commands',
    description:
      'Never forget a useful CLI command. Store your git aliases, Docker commands, and scripts with descriptions.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    accent: '#64748b',
    title: 'Files & Docs',
    description:
      'Upload context files, templates, images, and documents. Keep project assets together with your code knowledge.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    accent: '#6366f1',
    title: 'Collections',
    description:
      'Group related items into collections — React Patterns, AI Workflows, Interview Prep. Build your knowledge library.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <ScrollFadeIn className="text-center mb-14">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.2] mb-4">
            Everything You Need,{' '}
            <br />
            <span className="bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">
              One Place
            </span>
          </h2>
          <p className="text-white/50 max-w-[520px] mx-auto">
            Stop context switching between tools. DevStash keeps all of your developer resources
            organised and easy to find.
          </p>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <ScrollFadeIn key={f.title}>
              <div
                className="group relative bg-[#16161a] border border-white/[0.07] rounded-xl p-7 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12]"
              >
                {/* Top accent bar — reveals on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: f.accent }}
                />
                <div className="w-10 h-10 mb-4" style={{ color: f.accent }}>
                  {f.svg}
                </div>
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-[0.875rem] text-white/50 leading-relaxed">{f.description}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
