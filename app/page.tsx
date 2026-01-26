'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
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

  // Setup GSAP fade transitions between sections after splash completes
  useLayoutEffect(() => {
    if (!splashComplete || typeof window === 'undefined') return;

    // Wait for DOM and other ScrollTriggers to be ready
    const setupTimeout = setTimeout(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.homepage-section');
      if (sections.length === 0) return;

      // Create fade transitions for each section (except first and pinned sections)
      sections.forEach((section, index) => {
        const sectionId = section.id;
        
        // Skip first section - it starts visible
        if (index === 0) {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Skip pinned sections (voices) - they handle their own visibility
        if (sectionId === 'voices') {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Set initial state - sections start completely invisible
        gsap.set(section, { opacity: 0 });

        // Fade in when section enters viewport (0 to 100%)
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            // Smooth fade in from 0 to 1 based on scroll progress
            gsap.set(section, { opacity: self.progress });
          },
        });

        // Fade out the previous section as this one enters (skip if previous is pinned)
        if (index > 0) {
          const prevSection = sections[index - 1];
          const prevSectionId = prevSection.id;
          
          // Don't fade out pinned sections
          if (prevSectionId === 'voices') return;
          
          ScrollTrigger.create({
            trigger: section,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.5,
            onUpdate: (self) => {
              // Fade out previous section from 1 to 0
              const opacity = 1 - self.progress;
              gsap.set(prevSection, { opacity });
            },
            onLeaveBack: () => {
              // Restore previous section when scrolling back up
              gsap.to(prevSection, { opacity: 1, duration: 0.3 });
            },
          });
        }
      });

      ScrollTrigger.refresh(true);
    }, 500);

    return () => {
      clearTimeout(setupTimeout);
      // Clean up ScrollTriggers created here
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger && (st.vars.trigger as HTMLElement).classList?.contains('homepage-section')) {
          st.kill();
        }
      });
    };
  }, [splashComplete]);

  // Initialize scroll behavior after splash completes
  useEffect(() => {
    if (!splashComplete) return;

    // Ensure scroll is enabled
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Refresh ScrollTrigger after a short delay
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
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

      {/* Guided Journey Modal - Shows after splash completes */}
      <GuidedJourneyModal isOpen={showGuidedJourney} onClose={handleCloseGuidedJourney} />

      {/* Main Content - Full viewport sections with fade transitions */}
      <div
        className="relative z-10 w-full"
        style={{
          opacity: splashComplete ? 1 : 0,
          pointerEvents: splashComplete ? 'auto' : 'none',
        }}
      >
        <TheJourney />
        <WeWorkTogether />
        <VoicesOfTransformation />
        <ReadyToBegin />
      </div>
    </main>
  );
}
