'use client';

import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES } from '@/lib/themeConfig';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const bgColor = SECTION_THEMES[currentTheme]?.bg ?? SECTION_THEMES.hero.bg;

  return (
    <>
      {/* Fixed background that transitions */}
      <div
        className="fixed inset-0 -z-10 transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: bgColor }}
      />
      {/* Scrolling content */}
      <div className="relative z-0">
        {children}
      </div>
    </>
  );
}
