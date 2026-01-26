'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extend Window interface for Lenis
declare global {
  interface Window {
    __lenis?: {
      scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean; duration?: number }) => void;
      start: () => void;
      stop: () => void;
    };
  }
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Multiple strategies to ensure scroll reset on navigation

    // Strategy 1: Immediate native scroll reset
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Strategy 2: Reset Lenis scroll position (if Lenis is initialized)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    // Strategy 3: Force scroll reset after a short delay to catch any async renders
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
    };

    // Reset immediately and after DOM updates
    const timeoutId = setTimeout(resetScroll, 0);
    const timeoutId2 = setTimeout(resetScroll, 100);

    // Failsafe: ensure scrolling is enabled on navigation
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = '';
    html.style.overflow = '';

    // Ensure Lenis is running after navigation
    if (window.__lenis) {
      window.__lenis.start();
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [pathname]);

  return null;
}
