'use client';

import Button from './Button';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SECTION_THEMES } from '@/lib/themeConfig';

function QuickLink({ href, label, accentColor, bgColor }: { href: string; label: string; accentColor: string; bgColor: string }) {
  return (
    <Button
      href={href}
      text={`\u00ab ${label.toUpperCase()} \u00bb`}
      size="small"
      // Footer-specific palette
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
  
  // For approach page, use dark teal colors from theme
  // For other pages, keep the original green palette
  const footerBg = theme.headerBg || '#474e3a';
  const footerAccent = theme.accent;

  return (
    <footer className="w-full px-6 py-14 md:p-20" style={{ backgroundColor: footerBg }}>
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
            <div className="grid w-full max-w-[520px] grid-cols-3 gap-x-6 gap-y-3">
              <QuickLink href="/" label="Home" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/about" label="About Namita" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/approach" label="Approach" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/therapies" label="Therapies" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/immersions" label="Immersions" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/trainings" label="Trainings" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/faq" label="FAQ" accentColor={footerAccent} bgColor={footerBg} />
              <QuickLink href="/contact" label="Contact" accentColor={footerAccent} bgColor={footerBg} />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px md:block" style={{ backgroundColor: `${footerAccent}99` }} />

          {/* Contact */}
          <div className="flex flex-col items-center justify-center gap-4 text-center" style={{ color: footerAccent }}>
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Get In Touch
            </p>
            <div
              className="flex flex-col gap-2 text-[12px] leading-[normal]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <a href="mailto:hello@antarpravaah.com" className="hover:opacity-80">
                Email: hello@antarpravaah.com
              </a>
              <a href="tel:+919876543210" className="hover:opacity-80">
                Phone: +91 98765 43210
              </a>
              <p className="w-[209px]">Mumbai, India</p>
              <p className="w-[209px]">Mon-Sat: 9am - 6pm</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-[163px] w-px md:block" style={{ backgroundColor: `${footerAccent}99` }} />

          {/* Socials */}
          <div className="flex flex-col items-center justify-center gap-4 text-center" style={{ color: footerAccent }}>
            <p
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Socials
            </p>
            <div
              className="flex flex-col gap-2 text-[12px] leading-[normal]"
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
              <a
                className="hover:opacity-80"
                href="https://facebook.com/antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                FB : /antarpravaah
              </a>
              <a
                className="hover:opacity-80"
                href="https://youtube.com/@antarpravaah"
                target="_blank"
                rel="noreferrer"
              >
                YT : @antarpravaah
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

        {/* Copyright and legal */}
        <div 
          className="flex w-full flex-col items-center gap-3 border-t pt-6 text-center text-[10px] leading-normal"
          style={{ 
            borderColor: `${footerAccent}40`,
            color: `${footerAccent}cc`,
            fontFamily: 'var(--font-graphik), sans-serif'
          }}
        >
          <p>© {new Date().getFullYear()} Antar Pravaah. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:opacity-80">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:opacity-80">Terms of Service</a>
            <span>•</span>
            <a href="/disclaimer" className="hover:opacity-80">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


