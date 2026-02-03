'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Multiple strategies to ensure scroll reset on navigation

    // Strategy 1: Immediate native scroll reset
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Strategy 2: Force scroll reset after a short delay to catch any async renders
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Reset immediately and after DOM updates
    const timeoutId = setTimeout(resetScroll, 0);
    const timeoutId2 = setTimeout(resetScroll, 100);

    // Failsafe: ensure scrolling is enabled on navigation
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = '';
    html.style.overflow = '';

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [pathname]);

  return null;
}
