'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES, SectionId } from '@/lib/themeConfig';

// Inline SVG close icon using currentColor for theme-aware coloring
function CloseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M20.5998 22.2846C20.6177 22.2809 20.6343 22.2781 20.6524 22.2733C20.7028 22.2618 20.7562 22.2453 20.7904 22.2063C20.8651 22.1228 20.8175 21.9921 20.7638 21.8929C20.1935 20.8393 19.3074 20.1038 18.4769 19.2624C17.6463 18.421 16.8239 17.5204 16.1173 16.5503C15.0464 15.0821 13.784 12.8411 13.6819 11.0131C13.5531 8.73438 14.5085 6.33884 15.4923 4.33587C15.751 3.80874 17.5246 1.3877 17.3635 0.924626C17.1325 0.259234 15.2769 2.16794 14.9839 2.44428C11.5373 5.67709 9.27352 9.95238 11.3416 14.6169C11.432 14.8202 11.5248 15.0218 11.6221 15.2219C12.1652 16.3459 12.7914 17.4569 13.7588 18.2873C14.6108 19.0196 15.506 19.7035 16.4368 20.3325C17.1066 20.7854 17.7957 21.2111 18.5005 21.6057C19.1524 21.9716 19.8061 22.4306 20.6003 22.2814L20.5998 22.2846Z" fill="currentColor"/>
      <path d="M1.4002 1.98789C1.38232 1.99158 1.36567 1.99438 1.34763 1.99913C1.29716 2.01069 1.24376 2.0272 1.20956 2.06618C1.13487 2.14963 1.18253 2.28034 1.2362 2.37956C1.8065 3.4332 2.69257 4.16867 3.52314 5.01005C4.3537 5.85143 5.17608 6.75208 5.88271 7.72218C6.95359 9.1904 8.216 11.4314 8.31807 13.2594C8.44692 15.5381 7.49145 17.9336 6.50768 19.9366C6.24896 20.4637 4.47539 22.8848 4.63646 23.3478C4.86749 24.0132 6.72306 22.1045 7.01605 21.8282C10.4627 18.5954 12.7265 14.3201 10.6584 9.65557C10.568 9.45222 10.4752 9.25066 10.3779 9.05055C9.83482 7.92656 9.20862 6.81552 8.24119 5.98515C7.38922 5.25287 6.49401 4.56895 5.56316 3.94C4.89345 3.48706 4.20433 3.06136 3.49954 2.66672C2.84755 2.30088 2.19393 1.84181 1.3997 1.99106L1.4002 1.98789Z" fill="currentColor"/>
    </svg>
  );
}

// Inline SVG logo icon using currentColor for theme-aware coloring
function LogoIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="372" height="186" viewBox="0 0 372 186" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M90.06 84.4056C83.12 85.2256 74.92 83.1456 69.14 83.3556C63.62 83.5456 56.47 89.9556 58.2 97.2756C58.7 99.3856 60.04 101.216 61.67 102.646C65.18 105.726 69.92 107.036 74.57 107.566C103.56 110.906 125.26 85.9756 125.95 57.9156C127.08 12.0856 60.94 5.54562 29.1 19.1056C19.39 23.2456 10.45 29.7356 0 31.3056C1.88 24.6456 7.83 20.0056 13.76 16.4156C46.12 -3.18438 102.53 -8.83438 131.83 19.7256C155.14 42.4356 147.05 82.5856 126.31 104.266C116.33 114.686 102.84 121.806 88.53 123.616C67.73 126.246 38.78 116.686 36.05 92.6156C33.33 68.5756 60.2 51.8056 81.78 54.4156C87.63 55.1256 93.58 56.9956 97.78 61.1256C101.98 65.2556 103.96 72.0156 101.27 77.2556C98.84 81.9956 94.73 83.8556 90.06 84.4056Z" fill="currentColor"/>
      <path d="M215.97 99.3168C218.57 110.627 226.45 118.817 237.71 121.627C251.01 124.957 262.05 118.657 272.04 110.327C280.01 103.687 287.97 96.5368 292.55 87.2368C298.44 75.2868 302.48 51.3868 293.9 40.1368C286.9 30.9668 277.78 24.8768 266.24 22.9268C241.89 18.8068 220.49 29.7468 203.3 46.0068C188.81 59.7168 177.28 76.1868 165.86 92.5368C157.93 103.877 150.01 115.217 142.08 126.557C136.09 135.127 130.06 143.747 122.67 151.137C115.77 158.027 104.95 166.577 95.34 168.647C83.37 171.217 69.88 168.147 58.44 164.587C55.43 163.647 41.13 156.257 38.81 157.497C35.48 159.267 47.13 167.527 48.84 168.857C68.84 184.447 93.38 192.897 116.39 178.067C135.55 165.717 152.62 145.867 164.9 127.047C181.62 101.407 201.11 77.5768 222.92 56.1068C231.67 47.4868 245.54 44.5368 257.04 48.8268C263.76 51.3368 269.8 56.4468 272.03 63.2668C276.06 75.6268 261.1 100.197 246.71 91.5868C240.33 87.7668 236.78 81.6668 228.2 82.5768C216.76 83.7968 214.11 91.2668 215.96 99.3168H215.97Z" fill="currentColor"/>
      <path d="M347.91 87.2649C370.79 94.2849 382.25 54.9249 359.75 50.3149C337.58 45.7749 324.41 80.0449 347.91 87.2649Z" fill="currentColor"/>
    </svg>
  );
}

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
  logoColor?: string;
  logoFilter?: string;
}

export default function HamburgerMenu({
  headerBg,
  navTextColor,
  isLightHeader,
  logoColor,
  logoFilter,
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

      {/* Fullscreen Menu — mirrors the header layout exactly so logo/close
           land in the same pixel position as the header logo/hamburger icon */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col animate-in fade-in duration-300"
          style={{ backgroundColor: headerBg }}
        >
          {/* 
            Replicate the header's padding + inner-bar structure:
            header  → py-3 sm:py-4        (outer vertical)
            wrapper → px-2 sm:px-4         (outer horizontal)
            bar     → h-[70px] sm:h-[80px] px-3 sm:px-4  (inner bar)
            We only need the top portion to position logo & close correctly.
          */}
          <div className="pt-3 sm:pt-4 px-2 sm:px-4">
            <div className="flex h-[70px] sm:h-[80px] items-center justify-between px-3 sm:px-4">
              {/* Logo — same dimensions as Header logo link */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex h-[28px] sm:h-[34px] w-[56px] sm:w-[68px] items-center shrink-0"
              >
                <LogoIcon
                  className="h-full w-auto transition-[color] duration-500"
                  style={{ color: navTextColor }}
                />
              </Link>

              {/* Close Button — same 40×40 touch target as the hamburger button */}
              <button
                onClick={closeMenu}
                className="flex items-center justify-center w-10 h-10 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9ac1bf]"
                aria-label="Close menu"
              >
                <CloseIcon
                  className="w-[25px] h-[25px] transition-[color] duration-500"
                  style={{ color: navTextColor }}
                />
              </button>
            </div>
          </div>

          {/* Navigation Items - Centered in remaining space */}
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

