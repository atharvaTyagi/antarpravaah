'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES, SectionId } from '@/lib/themeConfig';
import { useUiStore } from '@/lib/stores/useUiStore';

const navItems = [
  { label: 'Therapies', href: '/therapies', themeId: 'therapies' as SectionId },
  { label: 'Approach', href: '/approach', themeId: 'approach' as SectionId },
  { label: 'About', href: '/about', themeId: 'about' as SectionId },
  { label: 'Immersions', href: '/immersions', themeId: 'immersions' as SectionId },
  { label: 'Contact', href: '/contact', themeId: 'contact' as SectionId },
];

export default function Header() {
  const pathname = usePathname();
  const setTheme = useThemeStore((state) => state.setTheme);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const splashComplete = useUiStore((state) => state.splashComplete);

  // Set theme based on current route
  useEffect(() => {
    if (pathname === '/') {
      setTheme('hero');
    } else {
      const navItem = navItems.find((item) => item.href === pathname);
      if (navItem) {
        setTheme(navItem.themeId);
      }
    }
  }, [pathname, setTheme]);

  const theme = SECTION_THEMES[currentTheme] || SECTION_THEMES['hero'];
  const headerBg = theme?.headerBg || '#354443';
  const isHome = pathname === '/';
  const isVisible = !isHome || splashComplete;

  // Handle logo src (works with both Next.js image imports and direct paths)

  return (
    <header 
      // Opaque full-width background so content can never be seen behind the header,
      // including the margins around the rounded inner container.
      className="fixed top-0 left-0 right-0 z-[60] w-full bg-[#f6edd0] py-6 transition-opacity duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      <div className="w-full px-4 md:px-6">
        <div
          className="flex h-[100px] w-full items-center justify-between rounded-[24px] px-5 py-4 transition-colors duration-1000 ease-in-out"
          style={{ backgroundColor: headerBg }}
        >
          {/* Logo */}
          <Link href="/" className="flex h-[42px] w-[309px] items-center">
            <img
              src="/logo_full.svg"
              alt="Antar Pravaah"
              className="h-auto w-full"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-[37px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`uppercase tracking-[1.92px] text-[#f6edd0] text-[12px] transition-colors hover:text-[#9ac1bf] ${
                    isActive ? 'font-bold' : 'font-light'
                  }`}
                  style={{ 
                    fontFamily: 'var(--font-graphik), sans-serif',
                    fontWeight: isActive ? 700 : 300,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

