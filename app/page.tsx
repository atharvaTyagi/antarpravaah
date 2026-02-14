'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import TheJourney from '@/components/TheJourney';
import WeWorkTogether from '@/components/WeWorkTogether';
import VoicesOfTransformation from '@/components/VoicesOfTransformation';
import ReadyToBegin from '@/components/ReadyToBegin';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import Button from '@/components/Button';
import { useUiStore } from '@/lib/stores/useUiStore';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// Section configuration - splash is first section, then journey, etc.
const SECTIONS: { id: string; type: 'splash' | 'static' | 'journey-scroll' | 'cards-scroll' | 'carousel-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'splash', type: 'splash', themeId: 'hero' },
  { id: 'journey', type: 'journey-scroll', themeId: 'journey' },
  { id: 'journey-cta', type: 'static', themeId: 'journey' },
  { id: 'work-together', type: 'cards-scroll', themeId: 'work-together' },
  { id: 'voices', type: 'carousel-scroll', themeId: 'voices' },
  { id: 'ready-to-begin', type: 'static', themeId: 'ready-to-begin' },
  { id: 'footer', type: 'footer', themeId: 'voices-footer' },
];

export default function Home() {
  // Splash interaction complete = blob animation done, user can scroll to next section
  const [splashInteractionComplete, setSplashInteractionComplete] = useState(false);
  const [showGuidedJourney, setShowGuidedJourney] = useState(false);
  const setGlobalSplashComplete = useUiStore((state) => state.setSplashComplete);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Section navigation state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Journey section scroll state
  const [isJourneyScrollActive, setIsJourneyScrollActive] = useState(false);
  const [journeyResetToStart, setJourneyResetToStart] = useState(false);
  const [journeyResetToEnd, setJourneyResetToEnd] = useState(false);

  // WeWorkTogether cards scroll state
  const [isCardsScrollActive, setIsCardsScrollActive] = useState(false);
  const [cardsResetToStart, setCardsResetToStart] = useState(false);
  const [cardsResetToEnd, setCardsResetToEnd] = useState(false);

  // VoicesOfTransformation carousel scroll state
  const [isCarouselScrollActive, setIsCarouselScrollActive] = useState(false);
  const [carouselResetToStart, setCarouselResetToStart] = useState(false);
  const [carouselResetToEnd, setCarouselResetToEnd] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const currentSectionRef = useRef(0);

  // Cooldown between section changes
  const sectionScrollCooldown = 800;

  // Detect mobile breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set --vh CSS variable for mobile viewport height
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set immediately
    setVh();

    // Update on resize and orientation change
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // Also set after a short delay to catch any browser chrome adjustments
    const timeoutId = setTimeout(setVh, 100);
    const delayedTimeout = setTimeout(setVh, 500);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      clearTimeout(timeoutId);
      clearTimeout(delayedTimeout);
    };
  }, []);

  // Go to section with GSAP animation
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;
    if (index === currentSectionRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    // Get section height (viewport height minus header)
    const sectionHeight = sectionsRef.current[0]?.offsetHeight || window.innerHeight - 148;
    const targetY = -index * sectionHeight;

    setIsAnimating(true);

    // Deactivate all scroll sections before animating
    setIsJourneyScrollActive(false);
    setIsCardsScrollActive(false);
    setIsCarouselScrollActive(false);

    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        currentSectionRef.current = index;
        setCurrentSection(index);
        lastScrollTimeRef.current = Date.now();

        const section = SECTIONS[index];

        // Update theme
        setTheme(section.themeId);

        // Handle journey section entry
        if (section.type === 'journey-scroll') {
          if (direction === 'down') {
            setJourneyResetToStart(true);
            setTimeout(() => setJourneyResetToStart(false), 100);
          } else {
            setJourneyResetToEnd(true);
            setTimeout(() => setJourneyResetToEnd(false), 100);
          }
          setTimeout(() => setIsJourneyScrollActive(true), 400);
        }

        // Handle cards section entry
        if (section.type === 'cards-scroll') {
          if (direction === 'down') {
            setCardsResetToStart(true);
            setTimeout(() => setCardsResetToStart(false), 100);
          } else {
            setCardsResetToEnd(true);
            setTimeout(() => setCardsResetToEnd(false), 100);
          }
          setTimeout(() => setIsCardsScrollActive(true), 400);
        }

        // Handle carousel section entry
        if (section.type === 'carousel-scroll') {
          if (direction === 'down') {
            setCarouselResetToStart(true);
            setTimeout(() => setCarouselResetToStart(false), 100);
          } else {
            setCarouselResetToEnd(true);
            setTimeout(() => setCarouselResetToEnd(false), 100);
          }
          setTimeout(() => setIsCarouselScrollActive(true), 400);
        }

        setIsAnimating(false);
      },
    });
  }, [isAnimating, setTheme]);

  // Edge reached handlers for scroll-controlled sections
  const handleJourneyEdgeReached = useCallback((edge: 'start' | 'end') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    if (edge === 'start') {
      // Move to previous section (Splash)
      goToSection(currentSectionRef.current - 1, 'up');
    } else if (edge === 'end') {
      // Move to next section (Journey CTA)
      goToSection(currentSectionRef.current + 1, 'down');
    }
  }, [goToSection]);

  const handleCardsEdgeReached = useCallback((edge: 'start' | 'end') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    if (edge === 'start') {
      // Move to previous section (Journey CTA)
      goToSection(currentSectionRef.current - 1, 'up');
    } else if (edge === 'end') {
      // Move to next section (VoicesOfTransformation)
      goToSection(currentSectionRef.current + 1, 'down');
    }
  }, [goToSection]);

  const handleCarouselEdgeReached = useCallback((edge: 'start' | 'end') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    if (edge === 'start') {
      // Move to previous section (WeWorkTogether)
      goToSection(currentSectionRef.current - 1, 'up');
    } else if (edge === 'end') {
      // Move to next section (ReadyToBegin)
      goToSection(currentSectionRef.current + 1, 'down');
    }
  }, [goToSection]);

  // Global scroll handler
  const handleScroll = useCallback((direction: 'up' | 'down') => {
    if (isAnimating) return;
    if (!isReady) return;

    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    const section = SECTIONS[currentSectionRef.current];

    // Splash section: only advance to journey when blob interaction is complete
    if (section.type === 'splash') {
      if (direction === 'down' && splashInteractionComplete) {
        goToSection(1, 'down');
      }
      return;
    }

    // Delegate to internal scroll handlers if active
    if (section.type === 'journey-scroll' && isJourneyScrollActive) return;
    if (section.type === 'cards-scroll' && isCardsScrollActive) return;
    if (section.type === 'carousel-scroll' && isCarouselScrollActive) return;

    // Handle static sections and footer
    if (direction === 'down') {
      if (currentSectionRef.current < SECTIONS.length - 1) {
        goToSection(currentSectionRef.current + 1, 'down');
      }
    } else {
      if (currentSectionRef.current > 0) {
        goToSection(currentSectionRef.current - 1, 'up');
      }
    }
  }, [isAnimating, isReady, splashInteractionComplete, isJourneyScrollActive, isCardsScrollActive, isCarouselScrollActive, goToSection]);

  // Setup GSAP Observer for global scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    // Create Observer for scroll handling
    const pageObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    observerRef.current = pageObserver;

    return () => {
      pageObserver.kill();
      observerRef.current = null;
    };
  }, [isReady, handleScroll]);

  // Initialize on mount: lock body scroll, start at section 0 (splash) with hero theme
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const initTimeout = setTimeout(() => {
      setIsReady(true);
      setTheme('hero');
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [setTheme]);

  const handleSplashInteractionComplete = () => {
    setSplashInteractionComplete(true);
    setGlobalSplashComplete(true);

    // Show guided journey modal after a short delay (desktop only)
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
    <>
      <style jsx global>{`
        :root {
          --header-height: 90px;
          --vh: 1vh;
        }
        @media (min-width: 640px) {
          :root {
            --header-height: 108px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --header-height: 148px;
          }
        }

        /* Section height classes that work across all mobile browsers */
        .section-height {
          height: calc(100vh - var(--header-height, 90px));
          min-height: calc(100vh - var(--header-height, 90px));
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
          min-height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }

        @supports (height: 100dvh) {
          .section-height {
            height: calc(100dvh - var(--header-height, 90px));
            min-height: calc(100dvh - var(--header-height, 90px));
          }
        }

        /* Main container positioning */
        .main-container {
          position: fixed;
          top: var(--header-height, 90px);
          left: 0;
          right: 0;
          bottom: 0;
          height: calc(100vh - var(--header-height, 90px));
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }

        @supports (height: 100dvh) {
          .main-container {
            height: calc(100dvh - var(--header-height, 90px));
          }
        }
      `}</style>

      <main className="relative">
        {/* Guided Journey Modal - Shows after splash interaction completes */}
        <GuidedJourneyModal isOpen={showGuidedJourney} onClose={handleCloseGuidedJourney} />

        {/* Fixed Container - scrolls through sections */}
        <div className="main-container overflow-hidden bg-[#f6edd0] z-[30]">
          <div ref={containerRef} className="will-change-transform">
            {/* Section 0: Splash */}
            <div
              ref={(el) => { if (el) sectionsRef.current[0] = el; }}
              className="section-height"
            >
              <SplashScreen onComplete={handleSplashInteractionComplete} />
            </div>

            {/* Section 1: Journey */}
            <div
              ref={(el) => { if (el) sectionsRef.current[1] = el; }}
              className="section-height"
            >
              <TheJourney
                isActive={isJourneyScrollActive}
                onEdgeReached={handleJourneyEdgeReached}
                resetToStart={journeyResetToStart}
                resetToEnd={journeyResetToEnd}
              />
            </div>

            {/* Section 2: Journey CTA */}
            <div
              ref={(el) => { if (el) sectionsRef.current[2] = el; }}
              className="section-height"
            >
              <div className="relative w-full h-full bg-[#f6edd0] flex items-center justify-center p-4 sm:px-6 lg:px-8">
                <div className="w-full h-full sm:h-auto sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex items-center justify-center">
                  <div className="w-full h-full sm:h-auto rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden ios-radius-fix bg-[#9ac1bf] p-6 sm:p-8 lg:p-10 text-center flex flex-col justify-center">
                  <div className="mb-6 sm:mb-8 lg:mb-10">
                    <p
                      className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#354443]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      If you&apos;re ready
                    </p>
                    <p
                      className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#354443]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      to stop searching
                    </p>
                    <p
                      className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#354443]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      outside yourself
                    </p>
                    <p
                      className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#354443]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      for answers...
                    </p>
                  </div>
                  <p
                    className="mb-6 sm:mb-8 lg:mb-10 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#354443]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    You&apos;re in the right place.
                  </p>
                  <Button
                    text="Begin Your Journey"
                    size="large"
                    mode="dark"
                    onClick={() => setShowGuidedJourney(true)}
                  />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: WeWorkTogether */}
            <div
              ref={(el) => { if (el) sectionsRef.current[3] = el; }}
              className="section-height"
            >
              <WeWorkTogether
                isActive={isCardsScrollActive}
                onEdgeReached={handleCardsEdgeReached}
                resetToStart={cardsResetToStart}
                resetToEnd={cardsResetToEnd}
              />
            </div>

            {/* Section 4: VoicesOfTransformation */}
            <div
              ref={(el) => { if (el) sectionsRef.current[4] = el; }}
              className="section-height"
            >
              <VoicesOfTransformation
                isActive={isCarouselScrollActive}
                onEdgeReached={handleCarouselEdgeReached}
                resetToStart={carouselResetToStart}
                resetToEnd={carouselResetToEnd}
              />
            </div>

            {/* Section 5: ReadyToBegin */}
            <div
              ref={(el) => { if (el) sectionsRef.current[5] = el; }}
              className="section-height"
            >
              <ReadyToBegin onBeginJourney={() => setShowGuidedJourney(true)} />
            </div>

            {/* Section 6: Footer */}
            <div
              ref={(el) => { if (el) sectionsRef.current[6] = el; }}
              className="section-height"
            >
              <Footer />
            </div>
          </div>
        </div>
    </main>
    </>
  );
}
