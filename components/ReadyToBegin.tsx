'use client';

import Section from './Section';
import Button from './Button';
import PageEndBlob from './PageEndBlob';

export default function ReadyToBegin() {
  return (
    <Section
      id="ready-to-begin"
      className="relative w-full bg-[#f6edd0] flex flex-col items-center justify-center"
    >
      <div className="mx-auto w-full max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 py-6 sm:py-8 lg:py-10">
          <div className="flex items-center justify-center py-3 sm:py-4 lg:py-5">
            <PageEndBlob color="#474e3a" className="h-8 sm:h-9 lg:h-10 w-auto" />
          </div>
          <p
            className="text-center text-[28px] sm:text-[38px] lg:text-[48px] leading-[normal] text-[#93a378] px-4"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Ready to begin your own transformation?
          </p>
          <Button
            text="Begin Your Journey"
            size="large"
            mode="light"
            colors={{
              fg: '#474e3a',
              fgHover: '#f6edd0',
              bgHover: '#474e3a',
            }}
          />
        </div>
      </div>
    </Section>
  );
}
