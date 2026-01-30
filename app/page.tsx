'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TheJourney from '@/components/TheJourney';
import WeWorkTogether from '@/components/WeWorkTogether';
import VoicesOfTransformation from '@/components/VoicesOfTransformation';
import ReadyToBegin from '@/components/ReadyToBegin';
import SplashScreen from '@/components/SplashScreen';
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

  // Initialize scroll behavior after splash completes
  useEffect(() => {
    if (!splashComplete) return;

    // Ensure scroll is enabled
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Refresh ScrollTrigger after a short delay
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);

    return () => {
      clearTimeout(refreshTimeout);
    };
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
    }, 2000);
  }; 

  const handleCloseGuidedJourney = () => {
    setShowGuidedJourney(false);
  };

  return (
    <main className="relative min-h-screen">
      {/* Splash Screen - Fixed overlay that fades out on scroll */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Guided Journey Modal - Shows after splash completes */}
      <GuidedJourneyModal isOpen={showGuidedJourney} onClose={handleCloseGuidedJourney} />

      {/* Main Content - Snap scroll sections */}
      <div
        className="relative z-10 w-full snap-scroll-wrapper"
        style={{
          opacity: splashComplete ? 1 : 0,
          pointerEvents: splashComplete ? 'auto' : 'none',
          // CSS Snap scrolling for smooth section transitions
          scrollSnapType: 'y proximity',
        }}
      >
        {/* TheJourney - Scrollable content section */}
        <div className="snap-section" style={{ scrollSnapAlign: 'start' }}>
          <TheJourney />
        </div>
        
        {/* WeWorkTogether - Card stack with internal snap */}
        <div className="snap-section" style={{ scrollSnapAlign: 'start' }}>
          <WeWorkTogether />
        </div>
        
        {/* VoicesOfTransformation - Horizontal carousel */}
        <div className="snap-section" style={{ scrollSnapAlign: 'start' }}>
          <VoicesOfTransformation />
        </div>
        
        {/* ReadyToBegin - CTA section */}
        <div className="snap-section" style={{ scrollSnapAlign: 'start' }}>
          <ReadyToBegin />
        </div>
      </div>
    </main>
  );
}
