'use client';

import { useEffect } from 'react';
import Section from '@/components/Section';

export default function TrainingsPage() {
  useEffect(() => {
    // Native scroll; no smooth scroll library needed
  }, []);

  return (
    <main className="min-h-screen pt-[148px]">
      <Section id="trainings-intro" className="mx-auto max-w-[1177px] px-8 py-16">
        <h1
          className="text-center text-[48px] leading-[1.0] text-[#000000]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Trainings
        </h1>
        <p
          className="mx-auto mt-6 max-w-[900px] text-center text-[16px] leading-relaxed text-[#000000]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
        >
          Coming soon.
        </p>
      </Section>
    </main>
  );
}


