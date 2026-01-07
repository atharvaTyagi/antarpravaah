'use client';

import { useState, useRef, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TheJourney from '@/components/TheJourney';
import WeWorkTogether from '@/components/WeWorkTogether';
import VoicesOfTransformation from '@/components/VoicesOfTransformation';
import SplashScreen from '@/components/SplashScreen';
import SectionSubheader from '@/components/SectionSubheader';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import { useUiStore } from '@/lib/stores/useUiStore';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Configure ScrollTrigger for better mobile support
  ScrollTrigger.config({
    // Don't interfere with native scroll on touch devices
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export default function Home() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [showGuidedJourney, setShowGuidedJourney] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const setGlobalSplashComplete = useUiStore((state) => state.setSplashComplete);

  useEffect(() => {
    // Initialize Lenis smooth scroll only after splash is complete
    if (!splashComplete) return;

    // Check if device is mobile/tablet - disable Lenis on touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMobileSize = window.innerWidth < 1024;

    // Use native scroll on mobile/tablet for better touch support
    if (isTouchDevice || isMobileSize) {
      // Just scroll to journey section with native scroll
      setTimeout(() => {
        const journeyElement = document.getElementById('journey');
        if (journeyElement) {
          journeyElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return;
    }

    // Small delay to ensure DOM is ready (desktop only)
    const initTimer = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // Sync Lenis scroll with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Use GSAP ticker to drive Lenis (ensures perfect sync)
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Convert to milliseconds
      });
      gsap.ticker.lagSmoothing(0); // Disable lag smoothing for smoother animations

      // Store lenis instance for cleanup
      lenisRef.current = lenis;
      // Expose Lenis globally so GSAP Observer-based sections can temporarily pause it.
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      // Scroll to #journey section after splash completes
      setTimeout(() => {
        const journeyElement = document.getElementById('journey');
        if (journeyElement && lenis) {
          // Offset for fixed main header height so content doesn't render behind it
          lenis.scrollTo('#journey', { duration: 1.5, offset: -188 });
        }
      }, 300);
    }, 200);

    return () => {
      clearTimeout(initTimer);
      gsap.ticker.remove(lenisRef.current?.raf as gsap.TickerCallback);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, [splashComplete]);

  const handleSplashComplete = () => {
    setSplashComplete(true);
    setGlobalSplashComplete(true);
    
    // Show guided journey modal after a short delay
    setTimeout(() => {
      setShowGuidedJourney(true);
    }, 2000); // 2 seconds after splash completes
  };

  const handleCloseGuidedJourney = () => {
    setShowGuidedJourney(false);
  };

  return (
    <main className="relative min-h-screen" style={{ overflow: 'visible' }}>
      {/* Splash Screen - Fixed overlay that fades out on scroll */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Fixed Section Subheader - shows current section title */}
      {splashComplete && <SectionSubheader />}

      {/* Guided Journey Modal - Shows after splash completes */}
      <GuidedJourneyModal isOpen={showGuidedJourney} onClose={handleCloseGuidedJourney} />

      {/* Main Content - Only visible after splash completes */}
      <div
        ref={contentRef}
        className="relative z-10 w-full pt-[90px] sm:pt-[108px] lg:pt-[148px]"
        style={{
          opacity: splashComplete ? 1 : 0,
          pointerEvents: splashComplete ? 'auto' : 'none',
          touchAction: 'auto', // Ensure touch scrolling works
        }}
      >
        <TheJourney />
        <WeWorkTogether />
        <VoicesOfTransformation />
      </div>
    </main>
  );
}
