import Link from 'next/link';
import { Code2 } from 'lucide-react';

const LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07]">
      <div className="max-w-[1100px] mx-auto px-6 pt-14 pb-12 grid grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-sm text-white mb-3">
            <Code2 className="w-4 h-4" />
            DevStash
          </Link>
          <p className="text-[0.82rem] text-white/25 leading-relaxed max-w-[220px]">
            Your developer knowledge hub. Snippets, prompts, commands, notes, files, images, and
            links — all in one place.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-2.5">
            <h4 className="text-[0.8rem] font-semibold text-white mb-1">{group}</h4>
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[0.82rem] text-white/25 hover:text-white/60 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] max-w-[1100px] mx-auto px-6 py-5">
        <p className="text-[0.78rem] text-white/20">
          &copy; {year} DevStash. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
