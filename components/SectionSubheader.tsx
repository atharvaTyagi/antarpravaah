'use client';

import { useEffect, useState, useCallback } from 'react';

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

// Total height of main header + subheader area
const HEADER_HEIGHT = 148;
const SUBHEADER_HEIGHT = 70; // Reduced height of subheader with blur
const DETECTION_OFFSET = HEADER_HEIGHT + SUBHEADER_HEIGHT;

export default function SectionSubheader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Detect which section is currently in view based on scroll position
  const detectActiveSection = useCallback(() => {
    const sectionElements = sections
      .map((s) => ({ id: s.id, el: document.getElementById(s.id) }))
      .filter((s) => s.el !== null) as { id: string; el: HTMLElement }[];

    if (!sectionElements.length) return;

    // Get the detection point (just below the headers)
    const detectionPoint = DETECTION_OFFSET + 50; // Small buffer

    // Find the section whose top is closest to (but above) the detection point
    // or that contains the detection point
    let activeId: string | null = null;

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { id, el } = sectionElements[i];
      const rect = el.getBoundingClientRect();

      // Section is active if its top is above the detection point
      // and its bottom is below the detection point (section contains the point)
      // OR if its top is at or above the detection point (for pinned sections)
      if (rect.top <= detectionPoint) {
        activeId = id;
        break;
      }
    }

    // Fallback: if no section found, use the first one that's visible at all
    if (!activeId) {
      for (const { id, el } of sectionElements) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > HEADER_HEIGHT && rect.top < window.innerHeight) {
          activeId = id;
          break;
        }
      }
    }

    if (activeId && activeId !== activeSection) {
      setActiveSection(activeId);
    }
  }, [activeSection]);

  useEffect(() => {
    // Initial detection
    detectActiveSection();

    // Listen to scroll events for continuous detection
    // This works better with GSAP-pinned sections than IntersectionObserver
    const handleScroll = () => {
      detectActiveSection();
    };

    // Use both native scroll and Lenis scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen to Lenis scroll if available
    const lenis = (window as unknown as { __lenis?: { on: (event: string, callback: () => void) => void; off: (event: string, callback: () => void) => void } }).__lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    // Poll periodically for pinned section changes (GSAP Observer doesn't fire scroll)
    const pollInterval = setInterval(detectActiveSection, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
      clearInterval(pollInterval);
    };
  }, [detectActiveSection]);

  // Don't render if no section is active
  if (!activeSection) return null;

  const currentSection = sections.find((s) => s.id === activeSection);
  if (!currentSection) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[55]"
      style={{
        top: '148px',
        height: '90px',
        background: 'linear-gradient(to bottom, rgba(246, 237, 208, 0.95) 0%, rgba(246, 237, 208, 0.7) 50%, rgba(246, 237, 208, 0.3) 80%, rgba(246, 237, 208, 0) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
      }}
    >
      <div className="mx-auto max-w-[1177px] px-8 py-3">
        <div className="relative text-center">
          <h2
            className="text-[42px] leading-[1.0] transition-colors duration-500"
            style={{
              fontFamily: 'var(--font-saphira), serif',
              color: currentSection.color,
            }}
          >
            {currentSection.title}
          </h2>
        </div>
      </div>
    </div>
  );
}

