'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import PathwaysCardStack from '@/components/PathwaysCardStack';
import PathwayCard from '@/components/PathwayCard';
import ThoughtsAndPonderings from '@/components/ThoughtsAndPonderings';
import { pathways } from '@/data/pathwaysContent';

gsap.registerPlugin(ScrollTrigger);

// Approach page button colors
const approachButtonColors = {
  fg: '#354443',
  fgHover: '#f6edd0',
  bgHover: '#354443',
};

export default function ApproachPage() {
  // Prepare cards for the sticky stack
  const pathwayCards = pathways.map((pathway) => ({
    key: pathway.id,
    render: <PathwayCard pathway={pathway} />,
  }));

  // Setup GSAP fade transitions between sections
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for DOM to be ready
    const setupTimeout = setTimeout(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.approach-section');
      if (sections.length === 0) return;

      // Create fade transitions for each section
      sections.forEach((section, index) => {
        const sectionId = section.id;

        // Skip first section - it starts visible
        if (index === 0) {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Skip pinned sections - they handle their own visibility
        // The pathways section is pinned internally by PathwaysCardStack
        if (sectionId === 'pathways') {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Set initial state - sections start completely invisible
        gsap.set(section, { opacity: 0 });

        // Fade in when section enters viewport
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(section, { opacity: self.progress });
          },
        });

        // Fade out the previous section as this one enters
        if (index > 0) {
          const prevSection = sections[index - 1];
          const prevSectionId = prevSection.id;

          // Don't fade out pinned sections
          if (prevSectionId === 'pathways') return;

          ScrollTrigger.create({
            trigger: section,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.5,
            onUpdate: (self) => {
              const opacity = 1 - self.progress;
              gsap.set(prevSection, { opacity });
            },
            onLeaveBack: () => {
              gsap.to(prevSection, { opacity: 1, duration: 0.3 });
            },
          });
        }
      });

      ScrollTrigger.refresh(true);
    }, 500);

    return () => {
      clearTimeout(setupTimeout);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#f6edd0]">
      {/* ===== SECTION 1: Introduction ===== */}
      <Section
        id="approach"
        className="approach-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0]"
      >
        <div className="mx-auto flex w-full max-w-full sm:max-w-[600px] lg:max-w-[723px] flex-col items-center gap-6 sm:gap-8 text-center">
          {/* Spiral SVG Illustration */}
          <div className="flex items-center justify-center h-[120px] sm:h-[160px] lg:h-[200px]">
            <img
              src="/approach_vector.svg"
              alt=""
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h1
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#9ac1bf]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            We Work Together
          </h1>

          {/* Description */}
          <div
            className="w-full text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center text-[#474e3a] px-2"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            <p className="mb-4">
              At Antar Pravaah, healing is a shared responsibility. We both do the work.
              Transformation demands commitment and persistence. It's not force, it's flow, but
              even in that, the commitment to follow the flow is integral to the work.
            </p>
            <p className="mb-4">
              I have been doing this work for 20 years, and I can tell you with a fair bit of
              certainty, it rarely works. Why? Because we want change to the extent of the
              outermost limits of our own comfort zone.
            </p>
            <p>
              Healing or transformation works when you are willing to take baby steps out of your
              comfortable space and step into the unfamiliar. The start is always from the place
              where you are. Every step matters.
            </p>
          </div>
        </div>
      </Section>

      {/* ===== SECTION 2: Three Pathways - Card Stack with Pattern Background ===== */}
      <Section
        id="pathways"
        className="approach-section relative z-10 w-full bg-[#354443]"
      >
        <PathwaysCardStack
          cards={pathwayCards}
          title="Three Pathways for You"
          showPattern
          pathways={pathways}
        />
      </Section>

      {/* ===== SECTION 3: Thoughts & Ponderings ===== */}
      <Section
        id="thoughts"
        className="approach-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#f6edd0]"
      >
        <ThoughtsAndPonderings />
      </Section>

      {/* ===== SECTION 4: CTA ===== */}
      <Section
        id="approach-cta"
        className="approach-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0]"
      >
        <div className="mx-auto flex max-w-full sm:max-w-[600px] lg:max-w-[799px] flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
          {/* Decorative blob */}
          <div className="flex items-center justify-center">
            <PageEndBlob
              color="#9ac1bf"
              className="h-auto w-[100px] sm:w-[130px] lg:w-[163px]"
            />
          </div>

          {/* Message */}
          <p
            className="text-[28px] sm:text-[32px] lg:text-[36px] leading-normal text-[#9ac1bf] px-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            If you feel called, I welcome you. Whatever you carry, you're not alone.
          </p>

          {/* CTA Button */}
          <Button
            text="Begin Your Journey"
            href="/contact"
            size="large"
            mode="light"
            colors={approachButtonColors}
          />
        </div>
      </Section>
    </main>
  );
}
