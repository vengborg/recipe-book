'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-linen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center text-white text-sm font-bold font-[family-name:var(--font-display)] transition-transform group-hover:rotate-12">
              V&M
            </div>
            <div className="hidden sm:block">
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-ink tracking-tight">
                Our Recipes
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className={`font-[family-name:var(--font-sans)] text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                isHome
                  ? 'text-terracotta bg-terracotta/8'
                  : 'text-ink-light hover:text-ink hover:bg-linen'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/recipe/new"
              className="btn-primary text-sm !py-2 !px-4"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="hidden sm:inline">Add Recipe</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
