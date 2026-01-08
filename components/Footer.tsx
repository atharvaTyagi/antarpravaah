'use client';

import { useState } from 'react';
import Button from './Button';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES } from '@/lib/themeConfig';
import PrivacyPolicyModal from './PrivacyPolicyModal';

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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
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
    <footer className="relative z-20 w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-14" style={{ backgroundColor: footerBg }}>
      <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-48px)] lg:max-w-[1282px] flex-col items-center gap-6 sm:gap-8 lg:gap-10">
        {/* Quick Links */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
          <p
            className="text-center text-[20px] sm:text-[22px] lg:text-[24px] leading-[normal]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400, color: footerAccent }}
          >
            Quick Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:gap-3 max-w-full">
            <QuickLink href="/about" label="About Namita" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/approach" label="Approach" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/therapies" label="Therapies" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/immersions" label="Immersions" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/trainings" label="Trainings" accentColor={footerAccent} bgColor={footerBg} />
            <QuickLink href="/contact#faq" label="FAQ" accentColor={footerAccent} bgColor={footerBg} />
          </div>
        </div>

        {/* Logo */}
        <div className="w-full overflow-hidden px-2 sm:px-4">
          <img
            src="/logo_full.svg"
            alt="Antar Pravaah"
            className="mx-auto block h-auto w-full max-w-full sm:max-w-[800px] lg:max-w-[1282px]"
          />
        </div>

        {/* Bottom meta row */}
        <div className="w-full px-2 sm:px-4">
          <div className="mx-auto flex w-full max-w-full sm:max-w-[800px] lg:max-w-[1282px] flex-col sm:flex-row items-center justify-between gap-2 pt-4">
            <div className="flex items-center gap-3 text-[12px] sm:text-[13px] leading-normal">
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="underline-offset-2 hover:underline tracking-[1.5px] sm:tracking-[1.92px] cursor-pointer"
                style={{ color: footerAccent, fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                PRIVACY POLICY
              </button>
            </div>
            <div
              className="text-[12px] sm:text-[13px] leading-normal text-center sm:text-right tracking-[1.5px] sm:tracking-[1.92px]"
              style={{ color: footerAccent, fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              © 2022 PRAKRITEE & {new Date().getFullYear()} ANTAR PRAVAAH. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </footer>
  );
}


