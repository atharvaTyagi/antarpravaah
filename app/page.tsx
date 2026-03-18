'use client';

import { useState, useEffect, useRef, useCallback, useReducer, useLayoutEffect } from 'react';
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
import ThoughtsAndPonderings from '@/components/ThoughtsAndPonderings';
import { useUiStore } from '@/lib/stores/useUiStore';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// ---------------------------------------------------------------------------
// Section configuration
// ---------------------------------------------------------------------------

type SectionType = 'splash' | 'static' | 'journey-scroll' | 'cards-scroll' | 'carousel-scroll' | 'footer';

interface SectionDef {
  id: string;
  type: SectionType;
  themeId: SectionId;
}

const SECTIONS: SectionDef[] = [
  { id: 'splash', type: 'splash', themeId: 'hero' },
  { id: 'journey', type: 'journey-scroll', themeId: 'journey' },
  { id: 'journey-cta', type: 'static', themeId: 'journey' },
  { id: 'thoughts', type: 'static', themeId: 'thoughts' },
  { id: 'work-together', type: 'cards-scroll', themeId: 'work-together' },
  { id: 'voices', type: 'carousel-scroll', themeId: 'voices' },
  { id: 'ready-to-begin', type: 'static', themeId: 'ready-to-begin' },
  { id: 'footer', type: 'footer', themeId: 'voices-footer' },
];

// ---------------------------------------------------------------------------
// Scroll-section state reducer
// ---------------------------------------------------------------------------

interface ScrollSectionState {
  journeyActive: boolean;
  journeyResetStart: boolean;
  journeyResetEnd: boolean;
  cardsActive: boolean;
  cardsResetStart: boolean;
  cardsResetEnd: boolean;
  carouselActive: boolean;
  carouselResetStart: boolean;
  carouselResetEnd: boolean;
}

type ScrollAction =
  | { type: 'DEACTIVATE_ALL' }
  | { type: 'ACTIVATE'; section: 'journey' | 'cards' | 'carousel' }
  | { type: 'RESET'; section: 'journey' | 'cards' | 'carousel'; edge: 'start' | 'end' }
  | { type: 'CLEAR_RESET'; section: 'journey' | 'cards' | 'carousel' };

const initialScrollState: ScrollSectionState = {
  journeyActive: false,
  journeyResetStart: false,
  journeyResetEnd: false,
  cardsActive: false,
  cardsResetStart: false,
  cardsResetEnd: false,
  carouselActive: false,
  carouselResetStart: false,
  carouselResetEnd: false,
};

function scrollReducer(state: ScrollSectionState, action: ScrollAction): ScrollSectionState {
  switch (action.type) {
    case 'DEACTIVATE_ALL':
      return {
        ...state,
        journeyActive: false,
        cardsActive: false,
        carouselActive: false,
      };
    case 'ACTIVATE':
      return {
        ...state,
        journeyActive: action.section === 'journey',
        cardsActive: action.section === 'cards',
        carouselActive: action.section === 'carousel',
      };
    case 'RESET':
      if (action.section === 'journey') {
        return {
          ...state,
          journeyResetStart: action.edge === 'start',
          journeyResetEnd: action.edge === 'end',
        };
      }
      if (action.section === 'cards') {
        return {
          ...state,
          cardsResetStart: action.edge === 'start',
          cardsResetEnd: action.edge === 'end',
        };
      }
      return {
        ...state,
        carouselResetStart: action.edge === 'start',
        carouselResetEnd: action.edge === 'end',
      };
    case 'CLEAR_RESET':
      if (action.section === 'journey') {
        return { ...state, journeyResetStart: false, journeyResetEnd: false };
      }
      if (action.section === 'cards') {
        return { ...state, cardsResetStart: false, cardsResetEnd: false };
      }
      return { ...state, carouselResetStart: false, carouselResetEnd: false };
    default:
      return state;
  }
}

// Map SectionType to the reducer's section key
function sectionTypeToKey(type: SectionType): 'journey' | 'cards' | 'carousel' | null {
  if (type === 'journey-scroll') return 'journey';
  if (type === 'cards-scroll') return 'cards';
  if (type === 'carousel-scroll') return 'carousel';
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
  const [splashInteractionComplete, setSplashInteractionComplete] = useState(false);
  const [showGuidedJourney, setShowGuidedJourney] = useState(false);
  const setGlobalSplashComplete = useUiStore((s) => s.setSplashComplete);
  const splashComplete = useUiStore((s) => s.splashComplete);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [scrollState, dispatch] = useReducer(scrollReducer, initialScrollState);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const currentSectionRef = useRef(0);

  const sectionScrollCooldown = 800;

  // --vh via visualViewport (single source of truth)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncVh = () => {
      const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    syncVh();
    checkMobile();

    // visualViewport.resize fires when the Safari toolbar collapses/expands
    window.visualViewport?.addEventListener('resize', syncVh);
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', syncVh);

    const t1 = setTimeout(syncVh, 100);
    const t2 = setTimeout(syncVh, 500);

    return () => {
      window.visualViewport?.removeEventListener('resize', syncVh);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', syncVh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Section navigation
  // ---------------------------------------------------------------------------

  const goToSection = useCallback(
    (index: number, direction: 'up' | 'down' = 'down') => {
      if (isAnimating) return;
      if (index < 0 || index >= SECTIONS.length) return;
      if (index === currentSectionRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      const sectionHeight = sectionsRef.current[0]?.offsetHeight || window.innerHeight - 148;
      const targetY = -index * sectionHeight;

      setIsAnimating(true);
      dispatch({ type: 'DEACTIVATE_ALL' });

      gsap.to(container, {
        y: targetY,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          currentSectionRef.current = index;
          lastScrollTimeRef.current = Date.now();

          const section = SECTIONS[index];
          setTheme(section.themeId);

          const key = sectionTypeToKey(section.type);
          if (key) {
            dispatch({ type: 'RESET', section: key, edge: direction === 'down' ? 'start' : 'end' });
            setTimeout(() => dispatch({ type: 'CLEAR_RESET', section: key }), 100);
            setTimeout(() => dispatch({ type: 'ACTIVATE', section: key }), 400);
          }

          setIsAnimating(false);
        },
      });
    },
    [isAnimating, setTheme],
  );

  // ---------------------------------------------------------------------------
  // Edge-reached callbacks
  // ---------------------------------------------------------------------------

  const handleEdgeReached = useCallback(
    (edge: 'start' | 'end') => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

      if (edge === 'start') {
        goToSection(currentSectionRef.current - 1, 'up');
      } else {
        goToSection(currentSectionRef.current + 1, 'down');
      }
    },
    [goToSection],
  );

  // ---------------------------------------------------------------------------
  // Global scroll handler
  // ---------------------------------------------------------------------------

  const handleScroll = useCallback(
    (direction: 'up' | 'down') => {
      if (isAnimating || !isReady) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

      const section = SECTIONS[currentSectionRef.current];

      if (section.type === 'splash') {
        if (direction === 'down' && splashInteractionComplete) {
          goToSection(1, 'down');
        }
        return;
      }

      // Delegate to internal handlers when scroll sections are active
      if (section.type === 'journey-scroll' && scrollState.journeyActive) return;
      if (section.type === 'cards-scroll' && scrollState.cardsActive) return;
      if (section.type === 'carousel-scroll' && scrollState.carouselActive) return;

      if (direction === 'down') {
        if (currentSectionRef.current < SECTIONS.length - 1) {
          goToSection(currentSectionRef.current + 1, 'down');
        }
      } else {
        if (currentSectionRef.current > 0) {
          goToSection(currentSectionRef.current - 1, 'up');
        }
      }
    },
    [isAnimating, isReady, splashInteractionComplete, scrollState.journeyActive, scrollState.cardsActive, scrollState.carouselActive, goToSection],
  );

  // ---------------------------------------------------------------------------
  // Helper: check if element is within a scrollable container
  // ---------------------------------------------------------------------------

  const isWithinScrollableContainer = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof Element)) return false;
    let element: Element | null = target;
    while (element && element !== document.body) {
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }, []);

  // ---------------------------------------------------------------------------
  // GSAP Observer (scoped to mainContainerRef — touch-action:none is in CSS)
  // ---------------------------------------------------------------------------

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady || !mainContainerRef.current) return;

    const pageObserver = Observer.create({
      target: mainContainerRef.current,
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

  // ---------------------------------------------------------------------------
  // Native scroll handlers for thoughts section (mobile native scroll passthrough)
  // ---------------------------------------------------------------------------

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    const handleWheel = (e: WheelEvent) => {
      const section = SECTIONS[currentSectionRef.current];
      if (isMobile && section.id === 'thoughts' && isWithinScrollableContainer(e.target)) {
        // Allow native scroll inside the thoughts section on mobile
        e.stopPropagation();
      }
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const section = SECTIONS[currentSectionRef.current];
      if (isMobile && section.id === 'thoughts' && isWithinScrollableContainer(e.target)) {
        e.stopPropagation();
        return;
      }
      const currentY = e.touches[0].clientY;
      lastTouchY = currentY;
    };

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
    };
  }, [isReady, isMobile, isWithinScrollableContainer]);

  // ---------------------------------------------------------------------------
  // Init: lock body scroll, set hero theme
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Splash complete
  // ---------------------------------------------------------------------------

  const handleSplashInteractionComplete = () => {
    setSplashInteractionComplete(true);
    setGlobalSplashComplete(true);

    setTimeout(() => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileSize = window.innerWidth < 1024;
      if (!isTouchDevice && !isMobileSize) {
        setShowGuidedJourney(true);
      }
    }, 2000);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <main className="relative">
        <GuidedJourneyModal isOpen={showGuidedJourney} onClose={() => setShowGuidedJourney(false)} />

        {/* clip-path instead of overflow-hidden — WebKit fails to paint children
             inside overflow:hidden + will-change:transform on a fixed-position parent.
             During splash, the header is hidden so we expand to full viewport height. */}
        <div
          ref={mainContainerRef}
          className="bg-[#f6edd0]"
          style={{
            clipPath: 'inset(0)',
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            touchAction: 'none',
            top: splashComplete ? 'var(--header-height, 90px)' : '0px',
            height: splashComplete ? undefined : '100dvh',
          }}
        >
          <div ref={containerRef} style={{ willChange: 'transform' }}>
            {/* Section 0: Splash — full viewport height before header appears */}
            <div
              ref={(el) => { if (el) sectionsRef.current[0] = el; }}
              style={{
                height: splashComplete ? undefined : '100dvh',
                minHeight: splashComplete ? undefined : '100dvh',
              }}
              className={splashComplete ? 'section-height' : undefined}
            >
              <SplashScreen onComplete={handleSplashInteractionComplete} />
            </div>

            {/* Section 1: Journey */}
            <div
              ref={(el) => { if (el) sectionsRef.current[1] = el; }}
              className="section-height"
            >
              <TheJourney
                isActive={scrollState.journeyActive}
                onEdgeReached={handleEdgeReached}
                resetToStart={scrollState.journeyResetStart}
                resetToEnd={scrollState.journeyResetEnd}
              />
            </div>

            {/* Section 2: Journey CTA */}
            <div
              ref={(el) => { if (el) sectionsRef.current[2] = el; }}
              className="section-height"
            >
              <div className="relative w-full h-full bg-[#f6edd0] flex items-center justify-center p-4 sm:px-6 lg:px-8">
                <div className="w-full h-full sm:h-auto sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex items-center justify-center">
                  <div
                    className="w-full h-full sm:h-auto rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#a2c0bf] p-6 sm:p-8 lg:p-10 text-center flex flex-col justify-center"
                    style={{ isolation: 'isolate', clipPath: 'inset(0 round 16px)' }}
                  >
                    <div className="mb-6 sm:mb-8 lg:mb-10">
                      <p
                        className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#384443]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        If you&apos;re ready
                      </p>
                      <p
                        className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#384443]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        to stop searching
                      </p>
                      <p
                        className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#384443]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        outside yourself
                      </p>
                      <p
                        className="mb-2 sm:mb-2.5 lg:mb-3 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#384443]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        for answers...
                      </p>
                    </div>
                    <p
                      className="mb-6 sm:mb-8 lg:mb-10 text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.0] text-[#384443]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      You&apos;re in the right place.
                    </p>
                    <Button
                      text="Begin Your Journey"
                      size="medium"
                      colors={{
                        fg: '#384443',
                        fgHover: '#a2c0bf',
                        bgHover: '#384443',
                      }}
                      onClick={() => setShowGuidedJourney(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Thoughts & Ponderings */}
            <div
              ref={(el) => { if (el) sectionsRef.current[3] = el; }}
              className="section-height relative flex flex-col px-4 sm:px-8 lg:px-12 py-8 sm:py-12 bg-[#f6edd0] overflow-y-auto md:overflow-hidden"
            >
              <ThoughtsAndPonderings />
            </div>

            {/* Section 4: WeWorkTogether */}
            <div
              ref={(el) => { if (el) sectionsRef.current[4] = el; }}
              className="section-height"
            >
              <WeWorkTogether
                isActive={scrollState.cardsActive}
                onEdgeReached={handleEdgeReached}
                resetToStart={scrollState.cardsResetStart}
                resetToEnd={scrollState.cardsResetEnd}
              />
            </div>

            {/* Section 5: VoicesOfTransformation */}
            <div
              ref={(el) => { if (el) sectionsRef.current[5] = el; }}
              className="section-height"
            >
              <VoicesOfTransformation
                isActive={scrollState.carouselActive}
                onEdgeReached={handleEdgeReached}
                resetToStart={scrollState.carouselResetStart}
                resetToEnd={scrollState.carouselResetEnd}
              />
            </div>

            {/* Section 6: ReadyToBegin */}
            <div
              ref={(el) => { if (el) sectionsRef.current[6] = el; }}
              className="section-height"
            >
              <ReadyToBegin onBeginJourney={() => setShowGuidedJourney(true)} />
            </div>

            {/* Section 7: Footer */}
            <div
              ref={(el) => { if (el) sectionsRef.current[7] = el; }}
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
