'use client';

import { useInView } from 'framer-motion';
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
  const isInView = useInView(internalRef, { amount: 0.5 });
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (isInView) {
      setTheme(id);
    }
  }, [isInView, id, setTheme]);

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

