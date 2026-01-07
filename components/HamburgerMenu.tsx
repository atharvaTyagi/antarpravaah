'use client';

import { useState } from 'react';
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
  navHoverColor: string;
  isLightHeader: boolean;
}

export default function HamburgerMenu({
  headerBg,
  navTextColor,
  navHoverColor,
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

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9ac1bf]"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
          style={{ backgroundColor: navTextColor }}
        />
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: navTextColor }}
        />
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
          style={{ backgroundColor: navTextColor }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Content */}
          <div
            className="absolute right-0 top-12 z-50 w-64 rounded-[16px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ backgroundColor: headerBg }}
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      px-4 py-3 rounded-[8px] uppercase tracking-[1.92px] text-[12px] 
                      transition-all duration-200
                      ${isActive ? 'font-bold' : 'font-light'}
                      hover:bg-opacity-10
                    `}
                    style={{
                      fontFamily: 'var(--font-graphik), sans-serif',
                      fontWeight: isActive ? 700 : 300,
                      color: navTextColor,
                      backgroundColor: isActive
                        ? `${navHoverColor}20`
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${navHoverColor}20`;
                      e.currentTarget.style.color = navHoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isActive
                        ? `${navHoverColor}20`
                        : 'transparent';
                      e.currentTarget.style.color = navTextColor;
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

