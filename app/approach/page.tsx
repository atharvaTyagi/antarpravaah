'use client';

import { useLayoutEffect, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import PathwaysCardStack from '@/components/PathwaysCardStack';
import PathwayCard from '@/components/PathwayCard';
import ThoughtsAndPonderings from '@/components/ThoughtsAndPonderings';
import Footer from '@/components/Footer';
import { pathways } from '@/data/pathwaysContent';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// Desktop section configuration with theme IDs
const SECTIONS_DESKTOP: { id: string; type: 'static' | 'pathways-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'approach-intro', type: 'static', themeId: 'approach' },
  { id: 'pathways', type: 'pathways-scroll', themeId: 'pathways' },
  { id: 'thoughts', type: 'static', themeId: 'thoughts' },
  { id: 'approach-cta', type: 'static', themeId: 'approach-cta' },
  { id: 'footer', type: 'footer', themeId: 'approach' },
];

// Mobile sections (same structure as desktop)
const SECTIONS_MOBILE: { id: string; type: 'static' | 'pathways-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'approach-intro', type: 'static', themeId: 'approach' },
  { id: 'pathways', type: 'pathways-scroll', themeId: 'pathways' },
  { id: 'thoughts', type: 'static', themeId: 'thoughts' },
  { id: 'approach-cta', type: 'static', themeId: 'approach-cta' },
  { id: 'footer', type: 'footer', themeId: 'approach' },
];

// Approach page button colors
const approachButtonColors = {
  fg: '#354443',
  fgHover: '#f6edd0',
  bgHover: '#354443',
};

export default function ApproachPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  const setTheme = useThemeStore((state) => state.setTheme);

  // State management
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPathwaysScrollActive, setIsPathwaysScrollActive] = useState(false);

  // Reset state for pathways section
  const [pathwaysResetToStart, setPathwaysResetToStart] = useState(false);
  const [pathwaysResetToEnd, setPathwaysResetToEnd] = useState(false);

  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 800; // ms

  // Get current sections based on viewport
  const SECTIONS = isMobile ? SECTIONS_MOBILE : SECTIONS_DESKTOP;

  // Prepare cards for the sticky stack
  const pathwayCards = pathways.map((pathway) => ({
    key: pathway.id,
    render: <PathwayCard pathway={pathway} />,
  }));

  // Initialize and check mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set initial theme
    setTheme(SECTIONS_DESKTOP[0].themeId);

    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(readyTimeout);
    };
  }, [setTheme]);

  // Handle mobile viewport height (accounts for browser toolbar)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;

    const container = containerRef.current;
    const targetSection = sectionsRef.current[index];
    if (!container || !targetSection) return;

    setIsAnimating(true);
    setIsPathwaysScrollActive(false);
    lastScrollTimeRef.current = Date.now();

    setTheme(SECTIONS[index].themeId);

    const targetY = -targetSection.offsetTop;

    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection(index);

        const section = SECTIONS[index];
        
        // Handle pathways section entry
        if (section.type === 'pathways-scroll') {
          if (direction === 'down') {
            setPathwaysResetToStart(true);
            setTimeout(() => setPathwaysResetToStart(false), 100);
          } else {
            setPathwaysResetToEnd(true);
            setTimeout(() => setPathwaysResetToEnd(false), 100);
          }
          setTimeout(() => setIsPathwaysScrollActive(true), 400);
        }

        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, SECTIONS, setTheme]);

  // Handle pathways scroll edge reached
  const handlePathwaysEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsPathwaysScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle scroll input
  const handleScroll = useCallback((deltaY: number) => {
    if (isAnimating) return;

    const section = SECTIONS[currentSection];
    
    // Delegate to pathways section if active
    if (section.type === 'pathways-scroll' && isPathwaysScrollActive) return;

    // Require minimum scroll threshold
    const minDelta = 30;
    if (Math.abs(deltaY) < minDelta) return;

    const isScrollingDown = deltaY > 0;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
    lastScrollTimeRef.current = now;

    if (isScrollingDown) {
      goToSection(currentSection + 1, 'down');
    } else {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, SECTIONS, isPathwaysScrollActive, goToSection]);

  // Setup wheel/touch event handlers
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      const section = SECTIONS[currentSection];
      if (section.type === 'pathways-scroll' && isPathwaysScrollActive) return;
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const section = SECTIONS[currentSection];
      if (section.type === 'pathways-scroll' && isPathwaysScrollActive) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;
      handleScroll(deltaY * 1.5);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isReady, currentSection, SECTIONS, isPathwaysScrollActive, handleScroll]);

  // Section height class name
  const sectionClass = "section-height";

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

      <main className="main-container overflow-hidden bg-[#f6edd0] z-[30]">
        <div ref={containerRef} className="will-change-transform">
          {/* ===== SECTION 1: Introduction ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[0] = el; }}
            className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
          >
            <div className="mx-auto flex w-full max-w-full sm:max-w-[600px] lg:max-w-[723px] flex-col items-center gap-6 sm:gap-8 text-center">
              {/* Spiral SVG Illustration */}
              <div className="flex items-center justify-center h-[120px] sm:h-[160px] lg:h-[200px]">
                <img
                  src="/approach_vector.svg"
                  alt=""
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Title */}
              <h1
                className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#9ac1bf]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                We Work Together
              </h1>

              {/* Description */}
              <div
                className="w-full text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center text-[#474e3a] px-2"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p className="mb-4">
                  At Antar Pravaah, healing is a shared responsibility. We both do the work.
                  Transformation demands commitment and persistence. It&apos;s not force, it&apos;s flow, but
                  even in that, the commitment to follow the flow is integral to the work.
                </p>
                <p className="mb-4">
                  I have been doing this work for 20 years, and I can tell you with a fair bit of
                  certainty, it rarely works. Why? Because we want change to the extent of the
                  outermost limits of our own comfort zone.
                </p>
                <p>
                  Healing or transformation works when you are willing to take baby steps out of your
                  comfortable space and step into the unfamiliar. The start is always from the place
                  where you are. Every step matters.
                </p>
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: Three Pathways - Card Stack with Pattern Background ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[1] = el; }}
            className={`relative flex items-center justify-center bg-[#354443] overflow-hidden ${sectionClass}`}
          >
            <PathwaysCardStack
              cards={pathwayCards}
              title="Three Pathways for You"
              showPattern
              pathways={pathways}
              isActive={isPathwaysScrollActive}
              onEdgeReached={handlePathwaysEdgeReached}
              resetToStart={pathwaysResetToStart}
              resetToEnd={pathwaysResetToEnd}
            />
          </div>

          {/* ===== SECTION 3: Thoughts & Ponderings ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[2] = el; }}
            className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
          >
            <ThoughtsAndPonderings />
          </div>

          {/* ===== SECTION 4: CTA ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[3] = el; }}
            className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
          >
            <div className="mx-auto flex max-w-full sm:max-w-[600px] lg:max-w-[799px] flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
              {/* Decorative blob */}
              <div className="flex items-center justify-center">
                <PageEndBlob
                  color="#9ac1bf"
                  className="h-auto w-[100px] sm:w-[130px] lg:w-[163px]"
                />
              </div>

              {/* Message */}
              <p
                className="text-[28px] sm:text-[32px] lg:text-[36px] leading-normal text-[#9ac1bf] px-4"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                If you feel called, I welcome you. Whatever you carry, you&apos;re not alone.
              </p>

              {/* CTA Button */}
              <Button
                text="Begin Your Journey"
                href="/contact"
                size="large"
                mode="light"
                colors={approachButtonColors}
              />
            </div>
          </div>

          {/* ===== SECTION 5: Footer ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[4] = el; }}
            className={`relative ${sectionClass}`}
          >
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
