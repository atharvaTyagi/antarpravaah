'use client';

import Button from './Button';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES } from '@/lib/themeConfig';

function QuickLink({ href, label, accentColor, bgColor }: { href: string; label: string; accentColor: string; bgColor: string }) {
  return (
    <Button
      href={href}
      text={` ${label.toUpperCase()} `}
      size="small"
      colors={{
        fg: accentColor,
        fgHover: bgColor,
        bgHover: accentColor,
      }}
      className="justify-self-center"
    />
  );
}

export default function Footer() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const theme = SECTION_THEMES[currentTheme] || SECTION_THEMES['hero'];

  // Use theme colors for footer
  // Background: darker color (headerBg)
  // Text: lighter color that contrasts with headerBg
  const footerBg = theme.headerBg || '#474e3a';

  // Choose a contrasting color for text - use accent if it contrasts, otherwise use text color or fallback to light
  const footerAccent =
    theme.accent !== theme.headerBg
      ? theme.accent
      : theme.text !== theme.headerBg
        ? theme.text
        : '#f6edd0';

  return (
    <footer className="relative z-20 w-full px-6 py-14 md:p-20" style={{ backgroundColor: footerBg }}>
      <div className="mx-auto flex max-w-[1282px] flex-col items-center gap-10">
        {/* Quick Links */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p
            className="text-center text-[24px] leading-[normal]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400, color: footerAccent }}
          >
            Quick Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <QuickLink href="/about" label="About Namita" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/approach" label="Approach" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/therapies" label="Therapies" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/immersions" label="Immersions" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/trainings" label="Trainings" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/contact#faq" label="FAQ" accentColor={footerAccent} bgColor={footerBg} />
          </div>
        </div>

        {/* Logo */}
        <div className="w-full overflow-hidden">
          <img
            src="/logo_full.svg"
            alt="Antar Pravaah"
            className="mx-auto block h-auto w-full max-w-[1282px]"
          />
        </div>
      </div>
    </footer>
  );
}


