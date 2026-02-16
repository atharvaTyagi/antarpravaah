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
      className="justify-self-center [&_span]:text-[14px] [&_span]:sm:text-[16px] [&_span]:lg:text-[18px] [&_span]:tracking-[2.4px] [&_span]:sm:tracking-[2.88px]"
    />
  );
}

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const theme = SECTION_THEMES[currentTheme] || SECTION_THEMES['hero'];

  // Use theme colors for footer
  const footerBg = theme.bg || '#474e3a';
  const footerText = theme.text || '#f6edd0';

  return (
    <footer className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-20 lg:py-20" style={{ backgroundColor: footerBg }}>
      <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-48px)] lg:max-w-[1282px] flex-col items-center gap-8 sm:gap-10 lg:gap-10">
        {/* Quick Links - Hidden on mobile */}
        <div className="hidden sm:flex flex-col items-center gap-3 sm:gap-4 w-full">
          <p
            className="text-center text-[20px] sm:text-[22px] lg:text-[24px] leading-[normal]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400, color: footerText }}
          >
            Quick Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 lg:gap-3 max-w-full">
            <QuickLink href="/about" label="About Namita" accentColor={footerText} bgColor={footerBg} />
            <QuickLink href="/approach" label="Approach" accentColor={footerText} bgColor={footerBg} />
            <QuickLink href="/therapies" label="Therapies" accentColor={footerText} bgColor={footerBg} />
            <QuickLink href="/immersions" label="Immersions" accentColor={footerText} bgColor={footerBg} />
            <QuickLink href="/trainings" label="Trainings" accentColor={footerText} bgColor={footerBg} />
            <QuickLink href="/contact#faq" label="FAQ" accentColor={footerText} bgColor={footerBg} />
          </div>
        </div>

        {/* Logo - smaller size - uses original colors */}
        <div className="w-full overflow-hidden px-2 sm:px-4">
          <img
            src="/logo_full.svg"
            alt="Antar Pravaah"
            className="mx-auto block h-auto w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[641px]"
            style={{ filter: 'none' }}
          />
        </div>

        {/* Bottom meta - vertically stacked */}
        <div className="w-full pt-6 sm:pt-8 lg:pt-10">
          <div className="mx-auto flex flex-col items-center gap-3 sm:gap-4">
            <div
              className="text-[11px] sm:text-[12px] leading-normal text-center tracking-[1.5px] sm:tracking-[1.92px] uppercase"
              style={{ color: footerText, fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              ©2022 Prakritee & ©Antar Pravaah. All Rights Reserved.
            </div>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-[11px] sm:text-[12px] leading-normal tracking-[1.5px] sm:tracking-[1.92px] uppercase hover:opacity-70 transition-opacity cursor-pointer"
              style={{ color: footerText, fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </footer>
  );
}


