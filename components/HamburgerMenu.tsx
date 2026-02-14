'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES, SectionId } from '@/lib/themeConfig';

const navItems = [
  { label: 'Therapies', href: '/therapies', themeId: 'therapies' as SectionId },
  { label: 'Approach', href: '/approach', themeId: 'approach' as SectionId },
  { label: 'About', href: '/about', themeId: 'about' as SectionId },
  { label: 'Immersions', href: '/immersions', themeId: 'immersions' as SectionId },
  { label: 'Contact', href: '/contact', themeId: 'contact' as SectionId },
];

interface HamburgerMenuProps {
  headerBg: string;
  navTextColor: string;
  isLightHeader: boolean;
}

export default function HamburgerMenu({
  headerBg,
  navTextColor,
  isLightHeader,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const theme = SECTION_THEMES[currentTheme] || SECTION_THEMES['hero'];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const originalOverflow = body.style.overflow;

    body.style.overflow = 'hidden';

    return () => {
      // Only restore if we're the ones who set it
      if (body.style.overflow === 'hidden') {
        body.style.overflow = originalOverflow;
      }
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9ac1bf]"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          width="25"
          height="12"
          viewBox="0 0 25 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[25px] h-[12px] transition-[fill] duration-500"
        >
          <rect width="24.8571" height="4.28571" rx="1.71429" fill={navTextColor} />
          <rect y="7.71484" width="24.8571" height="4.28571" rx="1.71429" fill={navTextColor} />
        </svg>
      </button>

      {/* Fullscreen Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col animate-in fade-in duration-300"
          style={{ backgroundColor: headerBg }}
        >
          {/* Header section with logo and close button */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
            {/* Logo - Icon only */}
            <Link href="/" onClick={closeMenu} className="flex h-[40px] sm:h-[50px] w-[80px] sm:w-[100px] items-center shrink-0">
              <img
                src="/asp_logo.svg"
                alt="Antar Pravaah"
                className="h-auto w-full transition-[filter] duration-500"
                style={{
                  filter: isLightHeader 
                    ? 'brightness(0) sepia(1) saturate(5) hue-rotate(-15deg)' 
                    : 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)',
                }}
              />
            </Link>

            {/* Close Button */}
            <button
              onClick={closeMenu}
              className="flex h-6 w-6 items-center justify-center hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9ac1bf]"
              aria-label="Close menu"
            >
              <img
                src="/Icon - Close.svg"
                alt="Close"
                className="h-6 w-6 transition-[filter] duration-500"
                style={{
                  filter: isLightHeader 
                    ? 'brightness(0) sepia(1) saturate(5) hue-rotate(-15deg)' 
                    : 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)',
                }}
              />
            </button>
          </div>

          {/* Navigation Items - Centered */}
          <nav className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8">
            <div className="flex flex-col gap-[40px] w-full max-w-md">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      text-center uppercase tracking-[2.56px] text-[16px] 
                      transition-[font-weight] duration-200
                      ${isActive ? 'font-bold' : 'font-light hover:font-bold'}
                    `}
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
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

