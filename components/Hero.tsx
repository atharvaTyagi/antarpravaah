'use client';

import Section from './Section';

export default function Hero() {
  return (
    <Section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#6a3f33]" />
      
      {/* Spiral Loader - placeholder for now */}
      <div className="absolute left-[22px] top-[53px] h-[1140px] w-[1339px] opacity-30 pointer-events-none">
        {/* Spiral graphic will be added here when available */}
        <div className="h-full w-full" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-8 py-24 pt-[200px]">
        <div className="mx-auto w-full max-w-[926px]">
          <div className="flex flex-col gap-10 rounded-[24px] bg-[#f6edd0] p-10 text-center">
            <p
              className="text-[48px] leading-[1.0] text-[#6a3f33]"
              style={{ 
                fontFamily: 'var(--font-saphira), serif',
                fontWeight: 400,
              }}
            >
              If we only remembered who we are, and why we are here, then life
              and everything that has happened in it, would make sense. We will
              no longer be lost or alone. We were, are and shall always be
              whole.
            </p>
            <p
              className="text-[48px] leading-[1.0] text-[#6a3f33]"
              style={{ 
                fontFamily: 'var(--font-saphira), serif',
                fontWeight: 400,
              }}
            >
              That is the Antar Smaran Process.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

