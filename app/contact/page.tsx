'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Section from '@/components/Section';

export default function ContactPage() {
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
    <main className="min-h-screen pt-[188px]">
      <Section id="contact" className="min-h-screen flex flex-col items-center justify-center px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Contact</h1>
          <p className="text-xl leading-relaxed">Contact page content coming soon...</p>
        </div>
      </Section>
    </main>
  );
}

