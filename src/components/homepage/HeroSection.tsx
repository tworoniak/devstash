'use client';

import Link from 'next/link';
import ScrollFadeIn from './ScrollFadeIn';
import ChaosAnimation from './ChaosAnimation';
import DashboardPreview from './DashboardPreview';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-[calc(64px+48px)] pb-20 px-6 text-center gap-14">
      <ScrollFadeIn className="max-w-[640px] mx-auto">
        <h1 className="text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold leading-[1.12] tracking-tight mb-5">
          Stop Losing Your{' '}
          <br />
          <span className="bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Developer Knowledge
          </span>
        </h1>
        <p className="text-[clamp(0.95rem,2vw,1.1rem)] text-white/50 max-w-[560px] mx-auto mb-8 leading-relaxed">
          Your snippets, prompts, commands, and notes are scattered across Notion, GitHub, Slack, and
          browser tabs. DevStash brings them all into one fast, searchable hub.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center font-semibold text-sm px-5 py-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white hover:opacity-85 transition-opacity"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center text-sm px-5 py-2.5 rounded-lg border border-white/[0.12] text-white/60 hover:border-white/25 hover:text-white transition-all"
          >
            See Features
          </a>
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn
        delay={150}
        className="flex items-center gap-5 w-full max-w-[900px] flex-col sm:flex-row"
      >
        {/* Chaos box */}
        <div className="flex-1 min-w-0 bg-[#16161a] border border-white/[0.07] rounded-2xl p-3.5 sm:w-auto w-full max-w-[400px]">
          <div className="text-[0.7rem] text-white/20 uppercase tracking-widest font-medium mb-2.5">
            Your knowledge today...
          </div>
          <ChaosAnimation />
        </div>

        {/* Arrow */}
        <div className="shrink-0 flex items-center justify-center w-12 text-white/20 rotate-90 sm:rotate-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 animate-[arrowPulse_2s_ease-in-out_infinite]"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        {/* Dashboard box */}
        <div className="flex-1 min-w-0 bg-[#16161a] border border-white/[0.07] rounded-2xl p-3.5 sm:w-auto w-full max-w-[400px]">
          <div className="text-[0.7rem] text-white/20 uppercase tracking-widest font-medium mb-2.5">
            ...with DevStash
          </div>
          <DashboardPreview />
        </div>
      </ScrollFadeIn>
    </section>
  );
}
