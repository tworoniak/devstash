'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navBg =
    scrolled || menuOpen
      ? 'bg-[#0a0a0b]/85 backdrop-blur-xl border-b border-white/[0.07]'
      : 'bg-transparent border-b border-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm text-white whitespace-nowrap"
        >
          <Code2 className="w-5 h-5" />
          DevStash
        </Link>

        <div className="hidden md:flex gap-6 flex-1">
          <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link
            href="/sign-in"
            className="text-sm px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white hover:opacity-85 transition-opacity"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden ml-auto p-1.5 text-white/70 hover:text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-6 pt-2 pb-5 border-t border-white/[0.07] bg-[#0a0a0b]/95">
          <a href="#features" className="text-sm text-white/60 hover:text-white" onClick={closeMenu}>
            Features
          </a>
          <a href="#pricing" className="text-sm text-white/60 hover:text-white" onClick={closeMenu}>
            Pricing
          </a>
          <Link
            href="/sign-in"
            className="text-sm text-white/60 hover:text-white"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white"
            onClick={closeMenu}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
