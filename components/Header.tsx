'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { useUiStore } from '@/lib/stores/useUiStore';
import { SECTION_THEMES, SectionId } from '@/lib/themeConfig';
import HamburgerMenu from './HamburgerMenu';
import LogoFull from './LogoFull';

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
  const isHome = pathname === '/';

  // Set initial theme based on current route (only on route change, not continuously)
  useEffect(() => {
    if (pathname === '/') {
      setTheme('hero');
    } else {
      const navItem = navItems.find((item) => item.href === pathname);
      if (navItem) {
        setTheme(navItem.themeId);
      }
    }
    // Only run when pathname changes, allowing Section components to update theme dynamically
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const theme = SECTION_THEMES[currentTheme] || SECTION_THEMES['hero'];
  const headerBg = theme?.headerBg || '#354443';
  const headerOuterBg = theme?.headerOuterBg || '#f6edd0';
  // Header hidden on homepage until splash text is fully revealed
  const isVisible = !isHome || splashComplete;

  // Utility function to check if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5; // Threshold for light vs dark
  };

  // Determine nav text color based on header background
  const isLightHeader = isLightColor(headerBg);
  const navTextColor = theme.headerText || (isLightHeader ? '#354443' : '#f6edd0');

  // Handle logo src (works with both Next.js image imports and direct paths)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] w-full py-3 sm:py-4 lg:py-6 transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        backgroundColor: headerOuterBg,
      }}
    >
      <div className="w-full px-2 sm:px-4 md:px-6">
        <div
          className="flex h-[70px] sm:h-[80px] lg:h-[100px] w-full items-center justify-between rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-4 transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: headerBg }}
        >
          {/* Logo */}
          <Link href="/" className="flex h-[28px] sm:h-[34px] lg:h-[42px] w-[180px] sm:w-[240px] lg:w-[309px] items-center shrink-0">
            {theme.logoColor ? (
              <LogoFull
                className="h-auto w-full transition-[color] duration-500"
                style={{ color: theme.logoColor }}
              />
            ) : (
              <img
                src="/logo_full.svg"
                alt="Antar Pravaah"
                className="h-auto w-full transition-[filter] duration-500"
                style={{
                  filter: theme.logoFilter ?? (isLightHeader ? 'brightness(0) sepia(1) saturate(5) hue-rotate(-15deg)' : 'none'),
                }}
              />
            )}
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center gap-[37px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`uppercase tracking-[1.92px] text-[12px] transition-[font-weight] ${
                    isActive ? 'font-bold' : 'font-light hover:font-bold'
                  }`}
                  style={{
                    fontFamily: 'var(--font-graphik), sans-serif',
                    fontWeight: isActive ? 700 : 300,
                    color: navTextColor,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile/Tablet Hamburger Menu */}
          <div className="flex lg:hidden">
            <HamburgerMenu
              headerBg={headerBg}
              navTextColor={navTextColor}
              isLightHeader={isLightHeader}
              logoColor={theme.logoColor}
              logoFilter={theme.logoFilter}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

