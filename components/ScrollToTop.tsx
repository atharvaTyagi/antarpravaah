'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Failsafe: ensure scrolling is enabled on navigation
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = '';
    html.style.overflow = '';
  }, [pathname]);

  return null;
}
