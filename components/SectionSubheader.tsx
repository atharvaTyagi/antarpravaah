'use client';

import { useEffect, useState } from 'react';

interface SectionConfig {
  id: string;
  title: string;
  color: string;
}

const sections: SectionConfig[] = [
  { id: 'journey', title: 'The Journey', color: '#354443' },
  { id: 'work-together', title: 'We Work Together', color: '#645c42' },
  { id: 'voices', title: 'Voices of Transformation', color: '#474e3a' },
];

export default function SectionSubheader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sectionElements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that is most visible (has the largest intersection ratio)
        // and is intersecting
        let bestMatch: { id: string; ratio: number } | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!bestMatch || entry.intersectionRatio > bestMatch.ratio) {
              bestMatch = { id, ratio: entry.intersectionRatio };
            }
          }
        });

        // If we found an intersecting section, set it as active
        if (bestMatch) {
          setActiveSection(bestMatch.id);
        } else {
          // Check if any section is still in view by checking their positions
          const viewportTop = 188; // Below main header
          for (const section of sectionElements) {
            const rect = section.getBoundingClientRect();
            // If section top is above viewport bottom and section bottom is below the header
            if (rect.top < window.innerHeight && rect.bottom > viewportTop) {
              setActiveSection(section.id);
              return;
            }
          }
        }
      },
      {
        root: null,
        // Adjust rootMargin to account for the main header (188px)
        rootMargin: '-188px 0px 0px 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Don't render if no section is active
  if (!activeSection) return null;

  const currentSection = sections.find((s) => s.id === activeSection);
  if (!currentSection) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[55] bg-[#f6edd0] py-6"
      style={{ top: '188px' }}
    >
      <div className="mx-auto max-w-[1177px] px-8">
        <div className="relative text-center">
          <h2
            className="text-[48px] leading-[1.0] transition-colors duration-500"
            style={{
              fontFamily: 'var(--font-saphira), serif',
              color: currentSection.color,
            }}
          >
            {currentSection.title}
          </h2>
        </div>
      </div>
      {/* Soft fade under header (full width) */}
      <div
        className="pointer-events-none h-8 w-full"
        style={{
          background:
            'linear-gradient(to bottom, rgba(246, 237, 208, 0.85), rgba(246, 237, 208, 0))',
        }}
      />
    </div>
  );
}

