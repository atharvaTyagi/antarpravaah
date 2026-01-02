'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

interface SectionProps {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, children, className = '' },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    // Use IntersectionObserver with rootMargin to detect when section crosses
    // a line near the top of the viewport (accounting for header height ~140px)
    // This works better for scroll-locked/pinned sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if the section is intersecting with our detection zone
          if (entry.isIntersecting) {
            setTheme(id);
          }
        });
      },
      {
        // Detection zone: a thin horizontal band below the header
        // Top margin pushes the detection line down (negative = down from top)
        // Bottom margin cuts off most of the viewport (negative = up from bottom)
        // This creates a detection zone around 140-300px from top of viewport
        rootMargin: '-140px 0px -60% 0px',
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [id, setTheme]);

  return (
    <section
      ref={(node) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      id={id}
      className={className}
    >
      {children}
    </section>
  );
});

export default Section;

