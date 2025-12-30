'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Section from '@/components/Section';

export default function FaqPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen pt-[148px]">
      <Section id="faq" className="mx-auto max-w-[1177px] px-8 py-16">
        <h1
          className="text-center text-[48px] leading-[1.0] text-[#3A3A3A]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          FAQ
        </h1>
        <p
          className="mx-auto mt-6 max-w-[900px] text-center text-[16px] leading-relaxed text-[#3A3A3A]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
        >
          Coming soon.
        </p>
      </Section>
    </main>
  );
}


