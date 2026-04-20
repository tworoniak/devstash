import Link from 'next/link';
import ScrollFadeIn from './ScrollFadeIn';

export default function CTASection() {
  return (
    <section className="py-24 text-center border-t border-white/[0.07]" style={{ background: '#111114' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <ScrollFadeIn>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.2] mb-4">
            Ready to Organize Your{' '}
            <br />
            <span className="bg-gradient-to-br from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Developer Knowledge?
            </span>
          </h2>
          <p className="text-white/50 mb-8">
            Join thousands of developers who stopped losing their best work.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center font-semibold px-8 py-3.5 rounded-xl text-white hover:opacity-85 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            Get Started Free
          </Link>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
