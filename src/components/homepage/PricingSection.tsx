'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollFadeIn from './ScrollFadeIn';

const FREE_FEATURES = [
  { text: '50 items total', enabled: true },
  { text: '3 collections', enabled: true },
  { text: 'Snippets, Prompts, Commands, Notes, Links', enabled: true },
  { text: 'Basic search', enabled: true },
  { text: 'File & Image uploads', enabled: false },
  { text: 'AI features', enabled: false },
];

const PRO_FEATURES = [
  'Unlimited items',
  'Unlimited collections',
  'File & Image uploads (10 MB / 5 MB)',
  'AI auto-tagging',
  'AI code explanation',
  'Prompt optimizer',
  'Data export (JSON / ZIP)',
  'Priority support',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="w-3.5 h-3.5 shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/20">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <ScrollFadeIn className="text-center mb-14">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.2] mb-4">
            Simple, Transparent{' '}
            <br />
            <span className="bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-white/50">Start free. Upgrade when you need more.</p>
        </ScrollFadeIn>

        {/* Toggle */}
        <ScrollFadeIn className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm ${yearly ? 'text-white/40' : 'text-white'}`}>Monthly</span>
          <button
            onClick={() => setYearly((v) => !v)}
            aria-checked={yearly}
            role="switch"
            aria-label="Toggle billing period"
            className="relative w-11 h-6 rounded-full border border-white/[0.12] transition-all duration-200 p-0"
            style={{
              background: yearly
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                : 'rgba(255,255,255,0.12)',
            }}
          >
            <span
              className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200"
              style={{ transform: yearly ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
          <span className={`text-sm flex items-center gap-2 ${yearly ? 'text-white' : 'text-white/40'}`}>
            Yearly
            <span className="text-[0.65rem] font-bold text-green-400 bg-green-400/10 border border-green-400/30 px-2 py-0.5 rounded-full">
              Save 25%
            </span>
          </span>
        </ScrollFadeIn>

        {/* Cards */}
        <ScrollFadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[700px] mx-auto">
            {/* Free */}
            <div className="bg-[#16161a] border border-white/[0.07] rounded-2xl p-8 hover:border-white/[0.12] transition-colors">
              <div className="mb-5">
                <h3 className="text-[1.1rem] font-semibold mb-1">Free</h3>
                <p className="text-[0.8rem] text-white/30">For getting started</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[2.5rem] font-extrabold leading-none">$0</span>
                <span className="text-sm text-white/50">/month</span>
              </div>
              <div className="h-5 mb-5" />
              <Link
                href="/register"
                className="flex justify-center w-full py-2.5 rounded-lg border border-white/[0.12] text-sm font-medium hover:border-white/25 hover:bg-white/[0.04] transition-all mb-6"
              >
                Get Started
              </Link>
              <ul className="flex flex-col gap-2.5">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-start gap-2.5 text-[0.85rem] ${f.enabled ? 'text-white/60' : 'text-white/25'}`}
                  >
                    {f.enabled ? <CheckIcon /> : <XIcon />}
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div
              className="relative rounded-2xl p-8 border transition-colors hover:border-blue-400/50"
              style={{
                background: 'linear-gradient(160deg, rgba(59,130,246,0.05) 0%, #16161a 60%)',
                borderColor: 'rgba(59,130,246,0.3)',
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.68rem] font-bold uppercase tracking-wider text-white px-3.5 py-1 rounded-full whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                Most Popular
              </div>
              <div className="mb-5">
                <h3 className="text-[1.1rem] font-semibold mb-1">Pro</h3>
                <p className="text-[0.8rem] text-white/30">For serious developers</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[2.5rem] font-extrabold leading-none">
                  {yearly ? '$6' : '$8'}
                </span>
                <span className="text-sm text-white/50">/month</span>
              </div>
              <div className="h-5 mb-5">
                {yearly && (
                  <p className="text-[0.75rem] text-white/30">Billed $72/year — save 25%</p>
                )}
              </div>
              <Link
                href="/register"
                className="flex justify-center w-full py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-85 transition-opacity mb-6"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                Get Started Free
              </Link>
              <ul className="flex flex-col gap-2.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.85rem] text-white/60">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
