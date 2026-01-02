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
        {/* Top row */}
        <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-10 md:px-5">
          {/* Quick Links */}
          <div className="flex flex-col items-center gap-4">
            <p
              className="text-center text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400, color: footerAccent }}
            >
              Quick Links
            </p>
            <div className="grid w-full max-w-[439px] grid-cols-3 gap-x-4 gap-y-2">
              <QuickLink href="/about" label="About Namita" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/approach" label="Approach" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/therapies" label="Therapies" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/immersions" label="Immersions" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/trainings" label="Trainings" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/contact#faq" label="FAQ" accentColor={footerAccent} bgColor={footerBg} />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px md:block" style={{ backgroundColor: footerAccent }} />

          {/* Contact */}
          <div className="flex flex-col items-center justify-center gap-4 text-center" style={{ color: footerAccent }}>
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Get In Touch
            </p>
            <div
              className="flex flex-col gap-4 text-[12px] leading-[normal]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <p className="w-[209px]">Email: [email address]</p>
              <p className="w-[209px]">Phone: [phone number]</p>
              <p className="w-[209px]">Location & Timings: [location details]</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px md:block" style={{ backgroundColor: footerAccent }} />

          {/* Socials */}
          <div className="flex flex-col items-center justify-center gap-4 text-center" style={{ color: footerAccent }}>
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Socials
            </p>
            <div
              className="flex flex-col gap-4 text-[12px] leading-[normal]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <a
                className="hover:opacity-80"
                href="https://instagram.com/antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                IG : @antarpravaah
              </a>
              <a
                className="hover:opacity-80"
                href="https://x.com/antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                X : @antarpravaah
              </a>
            </div>
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


