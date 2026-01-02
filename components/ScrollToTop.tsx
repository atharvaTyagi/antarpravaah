'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Also reset Lenis scroll position if available
    (window as unknown as { __lenis?: { scrollTo?: (target: number, options?: { immediate?: boolean }) => void } }).__lenis?.scrollTo?.(0, { immediate: true });
  }, [pathname]);

  return null;
}
