'use client';

import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES } from '@/lib/themeConfig';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const bgColor = SECTION_THEMES[currentTheme]?.bg ?? SECTION_THEMES.hero.bg;

  return (
    <>
      {/* Fixed background that transitions */}
      {/* z-0 not -z-10: negative z-index on fixed elements gets painted over by body background in Safari */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: bgColor }}
      />
      {/* Scrolling content — z-10 to sit above the background layer */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
