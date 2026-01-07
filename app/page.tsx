'use client';

import { useState, useEffect } from 'react';
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
}

export default function Home() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [showGuidedJourney, setShowGuidedJourney] = useState(false);
  const setGlobalSplashComplete = useUiStore((state) => state.setSplashComplete);

  // Scroll to journey section after splash completes
  useEffect(() => {
    if (!splashComplete) return;

    // Ensure scroll is enabled
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Scroll to #journey section with native smooth scroll
    setTimeout(() => {
      const journeyElement = document.getElementById('journey');
      if (journeyElement) {
        // Calculate offset for fixed header (148px main header + 40px padding)
        const headerOffset = 188;
        const elementPosition = journeyElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 500);

    // Refresh ScrollTrigger after scroll
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 2000);
  }, [splashComplete]);

  const handleSplashComplete = () => {
    setSplashComplete(true);
    setGlobalSplashComplete(true);
    
    // Show guided journey modal after a short delay (desktop only to avoid mobile scroll lock)
    setTimeout(() => {
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isMobileSize = window.innerWidth < 1024;
      if (!isTouchDevice && !isMobileSize) {
        setShowGuidedJourney(true);
      }
    }, 2000); // 2 seconds after splash completes
  };

  const handleCloseGuidedJourney = () => {
    setShowGuidedJourney(false);
  };

  return (
    <main className="relative min-h-screen">
      {/* Splash Screen - Fixed overlay that fades out on scroll */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Fixed Section Subheader - shows current section title */}
      {splashComplete && <SectionSubheader />}

      {/* Guided Journey Modal - Shows after splash completes */}
      <GuidedJourneyModal isOpen={showGuidedJourney} onClose={handleCloseGuidedJourney} />

      {/* Main Content - Only visible after splash completes */}
      <div
        className="relative z-10 w-full pt-[90px] sm:pt-[108px] lg:pt-[148px]"
        style={{
          opacity: splashComplete ? 1 : 0,
          pointerEvents: splashComplete ? 'auto' : 'none',
        }}
      >
        <TheJourney />
        <WeWorkTogether />
        <VoicesOfTransformation />
      </div>
    </main>
  );
}
