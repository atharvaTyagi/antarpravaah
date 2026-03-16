'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import ModalitiesScrollCard, { ModalityContent } from '@/components/ModalitiesScrollCard';
import MobileModalityCard, { MobileModalityData } from '@/components/MobileModalityCard';
import TherapyCard from '@/components/TherapyCard';
import TherapiesBlobScroll from '@/components/TherapiesBlobScroll';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import { therapies, DescriptionItem } from '@/data/therapiesContent';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// Desktop section configuration with theme IDs
const SECTIONS_DESKTOP: { id: string; type: 'static' | 'modalities-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'therapies-intro', type: 'static', themeId: 'therapies-intro' },
  { id: 'therapies-asp', type: 'static', themeId: 'therapies-asp' },
  { id: 'therapies-modalities', type: 'modalities-scroll', themeId: 'therapies-modalities' },
  { id: 'therapies-not-sure', type: 'static', themeId: 'therapies-not-sure' },
  { id: 'therapies-come-find-me', type: 'static', themeId: 'therapies-come-find-me' },
  { id: 'therapies-footer', type: 'footer', themeId: 'therapies-footer' },
];

// Mobile section configuration - modalities as carousel, blob as scroll-driven
const SECTIONS_MOBILE: { id: string; type: 'static' | 'asp-scroll' | 'modalities-carousel' | 'blob-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'therapies-intro', type: 'static', themeId: 'therapies-intro' },
  { id: 'therapies-asp', type: 'asp-scroll', themeId: 'therapies-asp' },
  { id: 'therapies-modalities', type: 'modalities-carousel', themeId: 'therapies-modalities' },
  { id: 'therapies-not-sure', type: 'static', themeId: 'therapies-not-sure' },
  { id: 'therapies-come-find-me', type: 'blob-scroll', themeId: 'therapies-come-find-me' },
  { id: 'therapies-footer', type: 'footer', themeId: 'therapies-footer' },
];

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',      // Dark brown text in non-hovered state
  fgHover: '#d6c68e', // Light gold text on hover
  bgHover: '#645c42', // Dark brown background on hover
};

export default function TherapiesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const modalitiesCarouselRef = useRef<HTMLDivElement>(null);

  const setTheme = useThemeStore((state) => state.setTheme);

  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isModalitiesScrollActive, setIsModalitiesScrollActive] = useState(false);
  const [aspCardVisible, setAspCardVisible] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [aspScrolledToEnd, setAspScrolledToEnd] = useState(false);
  const [isBlobScrollActive, setIsBlobScrollActive] = useState(false);
  const [isDesktopBlobActive, setIsDesktopBlobActive] = useState(false);
  const [isBlobScrollLocked, setIsBlobScrollLocked] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartAt, setModalStartAt] = useState<'welcome' | 'booking-calendar'>('welcome');

  // Track scroll reset states for modalities and blob
  const [modalitiesResetToStart, setModalitiesResetToStart] = useState(false);
  const [modalitiesResetToEnd, setModalitiesResetToEnd] = useState(false);
  const [blobResetToStart, setBlobResetToStart] = useState(false);
  const [blobResetToEnd, setBlobResetToEnd] = useState(false);

  // Mobile carousel state
  const modalitiesScrollX = useRef(0);
  const [currentModalityIndex, setCurrentModalityIndex] = useState(0);

  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 1000;

  // Get current sections based on viewport
  const SECTIONS = isMobile ? SECTIONS_MOBILE : SECTIONS_DESKTOP;

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

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;

    const container = containerRef.current;
    const targetSection = sectionsRef.current[index];
    if (!container || !targetSection) return;

    setIsAnimating(true);
    setIsModalitiesScrollActive(false);
    setIsBlobScrollActive(false);
    lastScrollTimeRef.current = Date.now();

    // Trigger ASP card animation when navigating to section 1 or later
    if (index >= 1 && !aspCardVisible) {
      setAspCardVisible(true);
    }

    setTheme(SECTIONS[index].themeId);

    const targetY = -targetSection.offsetTop;

    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection(index);

        const section = SECTIONS[index];
        
        // Desktop modalities scroll handling
        if (section.type === 'modalities-scroll') {
          if (direction === 'down') {
            setModalitiesResetToStart(true);
            setTimeout(() => setModalitiesResetToStart(false), 100);
          } else {
            setModalitiesResetToEnd(true);
            setTimeout(() => setModalitiesResetToEnd(false), 100);
          }
          setTimeout(() => setIsModalitiesScrollActive(true), 400);
        }

        // Mobile modalities carousel - reset position
        if (section.type === 'modalities-carousel') {
          if (direction === 'down') {
            modalitiesScrollX.current = 0;
            setCurrentModalityIndex(0);
            if (modalitiesCarouselRef.current) {
              gsap.set(modalitiesCarouselRef.current, { x: 0 });
            }
          }
        }

        // Mobile blob scroll handling
        if (section.type === 'blob-scroll') {
          if (direction === 'down') {
            setBlobResetToStart(true);
            setTimeout(() => setBlobResetToStart(false), 100);
          } else {
            setBlobResetToEnd(true);
            setTimeout(() => setBlobResetToEnd(false), 100);
          }
          setTimeout(() => setIsBlobScrollActive(true), 400);
        }

        // Desktop blob animation - activate when landing on the blob section
        if (section.id === 'therapies-come-find-me' && !isMobile) {
          setTimeout(() => setIsDesktopBlobActive(true), 300);
        }

        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, SECTIONS, setTheme, isMobile, aspCardVisible, isBlobScrollLocked]);

  // Handle modalities scroll edge reached
  const handleModalitiesEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsModalitiesScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle blob scroll edge reached (mobile)
  const handleBlobEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsBlobScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle card expanded state change (mobile modalities)
  const handleCardExpandedChange = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded);
  }, []);

  // Handle ASP scroll end (mobile)
  const handleAspScrollEnd = useCallback(() => {
    setAspScrolledToEnd(true);
  }, []);

  // Handle blob scroll lock state change
  const handleBlobScrollLockChange = useCallback((locked: boolean) => {
    setIsBlobScrollLocked(locked);
  }, []);

  // Handle desktop blob edge reached
  const handleDesktopBlobEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle scroll input
  const handleScroll = useCallback((deltaY: number) => {
    if (isAnimating || isCardExpanded) return;

    const section = SECTIONS[currentSection];
    
    // Skip if internal scroll handlers are active
    if (section.type === 'modalities-scroll' && isModalitiesScrollActive) return;
    if (section.type === 'blob-scroll' && isBlobScrollActive) return;
    
    // CRITICAL: Block all scroll if blob scroll is locked (desktop)
    if (isBlobScrollLocked) return;

    // Require minimum scroll threshold to prevent oversensitive scrolling
    const minDelta = 30;
    if (Math.abs(deltaY) < minDelta) return;

    const isScrollingDown = deltaY > 0;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    // Mobile ASP section - check if content is scrolled to end
    if (isMobile && section.type === 'asp-scroll' && isScrollingDown && !aspScrolledToEnd) {
      return; // Block forward scroll until ASP content is fully scrolled
    }

    // Mobile modalities carousel - handle horizontal scroll
    if (isMobile && section.type === 'modalities-carousel') {
      const modalityTherapies = therapies.filter((t) => t.id !== 'antar-smaran-process');
      const totalCards = modalityTherapies.length;
      const cardWidth = 353 + 16; // Card width + gap
      
      if (isScrollingDown) {
        if (currentModalityIndex < totalCards - 1) {
          const newIndex = currentModalityIndex + 1;
          setCurrentModalityIndex(newIndex);
          modalitiesScrollX.current = newIndex * cardWidth;
          if (modalitiesCarouselRef.current) {
            gsap.to(modalitiesCarouselRef.current, {
              x: -modalitiesScrollX.current,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
          lastScrollTimeRef.current = now;
          return;
        }
      } else {
        if (currentModalityIndex > 0) {
          const newIndex = currentModalityIndex - 1;
          setCurrentModalityIndex(newIndex);
          modalitiesScrollX.current = newIndex * cardWidth;
          if (modalitiesCarouselRef.current) {
            gsap.to(modalitiesCarouselRef.current, {
              x: -modalitiesScrollX.current,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
          lastScrollTimeRef.current = now;
          return;
        }
      }
    }

    lastScrollTimeRef.current = now;

    if (isScrollingDown) {
      goToSection(currentSection + 1, 'down');
    } else {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, isCardExpanded, currentSection, SECTIONS, isModalitiesScrollActive, isBlobScrollActive, isMobile, aspScrolledToEnd, currentModalityIndex, goToSection, isBlobScrollLocked]);

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

  // Setup wheel/touch event handlers
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      if (isCardExpanded) return;
      const section = SECTIONS[currentSection];
      if (section.type === 'modalities-scroll' && isModalitiesScrollActive) return;
      if (section.type === 'blob-scroll' && isBlobScrollActive) return;
      // CRITICAL: Block wheel events if blob scroll is locked
      if (isBlobScrollLocked) return;
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isCardExpanded) return;
      const section = SECTIONS[currentSection];
      if (section.type === 'modalities-scroll' && isModalitiesScrollActive) return;
      if (section.type === 'blob-scroll' && isBlobScrollActive) return;
      // CRITICAL: Block touch events if blob scroll is locked
      if (isBlobScrollLocked) return;
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
  }, [isReady, currentSection, SECTIONS, isModalitiesScrollActive, isBlobScrollActive, isCardExpanded, handleScroll, isBlobScrollLocked]);

  // Get Antar Smaran Process for featured section
  const antarSmaranProcess = therapies.find((t) => t.id === 'antar-smaran-process');

  // Get all other therapies for the modalities section (excluding ASP)
  const modalityTherapies = therapies.filter((t) => t.id !== 'antar-smaran-process');

  // Transform therapies data to ModalityContent format for the scroll card (desktop)
  const modalitiesContent: ModalityContent[] = modalityTherapies.map((therapy) => {
    // Handle description - can be string or array
    let descriptionArray: string[] = [];
    if (typeof therapy.description === 'string') {
      descriptionArray = [therapy.description];
    } else {
      descriptionArray = therapy.description.map((item) => {
        if (typeof item === 'string') return item;
        const descItem = item as DescriptionItem;
        return `${descItem.heading}: ${descItem.text}`;
      });
    }

    // Split bestFor into two columns
    const midpoint = Math.ceil(therapy.bestFor.length / 2);
    const column1 = therapy.bestFor.slice(0, midpoint);
    const column2 = therapy.bestFor.slice(midpoint);

    return {
      id: therapy.id,
      title: therapy.title,
      subtitle: therapy.subtitle,
      description: descriptionArray,
      bestFor: {
        column1,
        column2,
      },
      sessionDuration: therapy.duration,
      ctaText: therapy.ctaText,
      iconSrc: therapy.icon,
    };
  });

  // Transform therapies data to MobileModalityData format for mobile cards
  const mobileModalitiesContent: MobileModalityData[] = modalityTherapies.map((therapy) => {
    let descriptionArray: string[] = [];
    if (typeof therapy.description === 'string') {
      descriptionArray = [therapy.description];
    } else {
      descriptionArray = therapy.description.map((item) => {
        if (typeof item === 'string') return item;
        const descItem = item as DescriptionItem;
        return `${descItem.heading}: ${descItem.text}`;
      });
    }

    const midpoint = Math.ceil(therapy.bestFor.length / 2);
    const column1 = therapy.bestFor.slice(0, midpoint);
    const column2 = therapy.bestFor.slice(midpoint);

    return {
      id: therapy.id,
      title: therapy.title,
      subtitle: therapy.subtitle,
      description: descriptionArray,
      bestFor: {
        column1,
        column2,
      },
      sessionDuration: therapy.duration,
      ctaText: therapy.ctaText,
      iconSrc: therapy.icon,
    };
  });

  // Section height class name
  const sectionClass = "section-height";

  // Modal handlers
  const handleOpenModalInitial = useCallback(() => {
    setModalStartAt('welcome');
    setIsModalOpen(true);
  }, []);

  const handleOpenModalCalendar = useCallback(() => {
    setModalStartAt('booking-calendar');
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
          
          {/* ===== MOBILE LAYOUT ===== */}
          {isMobile ? (
            <>
              {/* Section 1: Introduction */}
              <div
                ref={(el) => { if (el) sectionsRef.current[0] = el; }}
                className={`relative flex flex-col items-center justify-center px-5 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <div className="max-w-full mx-auto text-center flex flex-col gap-4 px-4">
                  <h1
                    className="text-[36px] leading-[1.0] text-[#645c42]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Therapies
                  </h1>
                  <p
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-none text-[#645c42] tracking-normal"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    Possibilities for Change
                  </p>
                  <div
                    className="text-[#645c42] text-[16px] leading-[24px] text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-4">
                      Combining bodywork and energy healing modalities opens powerful possibilities for
                      healing—from acute and chronic illnesses to pain management, trauma release, and
                      recovery from abuse. These therapies support the transformation of patterns related to
                      loss, help dissolve blocks in relationships, assist in post-accident or post-surgical
                      integration, and bring awareness to inherited family dynamics that may still be
                      influencing your life.
                    </p>
                    <p>
                      Each session at Antar Pravaah is designed to meet you where you are, using natural
                      healing practices to support deep, lasting change.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: ASP Card with Scrollable Content */}
              {antarSmaranProcess && (
                <div
                  ref={(el) => { if (el) sectionsRef.current[1] = el; }}
                  className={`relative flex items-center justify-center px-5 py-4 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
                >
                  <div className="w-full h-full">
                    <TherapyCard 
                      therapy={antarSmaranProcess} 
                      isVisible={aspCardVisible} 
                      isMobile={true}
                      onScrollEnd={handleAspScrollEnd}
                      onCtaClick={handleOpenModalInitial}
                    />
                  </div>
                </div>
              )}

              {/* Section 3: Modalities Carousel */}
              <div
                ref={(el) => { if (el) sectionsRef.current[2] = el; }}
                className={`relative flex flex-col bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                {/* Sticky Title */}
                <div className="sticky top-0 z-10 bg-[#f6edd0] pt-4 pb-4 px-5">
                  <h2
                    className="text-[48px] leading-[1.0] text-[#645c42] text-center"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Our Modalities
                  </h2>
                </div>

                {/* Carousel Container */}
                <div className="flex-1 flex items-center overflow-hidden px-5 py-8">
                  <div
                    ref={modalitiesCarouselRef}
                    className="flex gap-4 will-change-transform"
                  >
                    {mobileModalitiesContent.map((modality) => (
                      <div key={modality.id} className="shrink-0">
                        <MobileModalityCard
                          data={modality}
                          onExpandedChange={handleCardExpandedChange}
                          onCtaClick={handleOpenModalCalendar}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: Not Sure Section */}
              <div
                ref={(el) => { if (el) sectionsRef.current[3] = el; }}
                className={`relative flex flex-col items-center justify-center px-5 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <div className="flex flex-col items-center gap-6 text-center">
                  {/* Decorative divider */}
                  <div className="flex items-center justify-center">
                    <img 
                      src="/page_end_blob.svg" 
                      alt="" 
                      className="w-[100px] h-auto"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(83%) sepia(15%) saturate(630%) hue-rotate(7deg) brightness(95%) contrast(85%)'
                      }}
                    />
                  </div>

                  <h2
                    className="text-[24px] leading-[1.2] text-[#645c42] px-4"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Not sure which therapy is right for you?
                  </h2>

                  <p
                    className="text-[16px] leading-normal text-[#645c42] uppercase tracking-[2.56px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    Find your path
                  </p>

                  <p
                    className="text-[16px] leading-[24px] text-[#645c42] text-center px-4"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    Every body speaks a different language. If you&apos;re unsure which modality will resonate
                    most deeply with you, we offer a complimentary 30-minute consultation to help guide you
                    to the therapy that will serve your healing journey best.
                  </p>

                  {/* Multi-line CTA Button */}
                  <button
                    onClick={handleOpenModalInitial}
                    className="group inline-flex items-center justify-center gap-2 p-3 text-[#645c42] hover:opacity-80 transition-opacity"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4 shrink-0" aria-hidden>
                      <path d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z" fill="currentColor"/>
                      <path d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z" fill="currentColor"/>
                    </svg>
                    <span className="text-center text-[18px] tracking-[2.88px] uppercase leading-tight">
                      <span className="block">Schedule</span>
                      <span className="block">a Free</span>
                      <span className="block">Consultation</span>
                    </span>
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4 shrink-0" aria-hidden>
                      <path d="M2.69019 9.10567C2.68288 9.10558 2.67611 9.10574 2.66866 9.10526C2.64795 9.10457 2.62575 9.10222 2.60966 9.0899C2.57463 9.06362 2.58486 9.01034 2.59955 8.96862C2.75564 8.52544 3.05753 8.18017 3.3305 7.79866C3.60348 7.41714 3.86931 7.01367 4.0848 6.59226C4.4115 5.95438 4.76304 5.00818 4.683 4.30464C4.58386 3.42752 4.04831 2.58576 3.52743 1.89555C3.39042 1.71389 2.52974 0.922658 2.56292 0.73448C2.61044 0.464118 3.46981 1.05424 3.60385 1.13789C5.1795 2.11502 6.35612 3.57618 5.84566 5.50449C5.82333 5.58856 5.79992 5.67214 5.77461 5.7555C5.63391 6.22345 5.45951 6.69259 5.13169 7.07999C4.84308 7.42154 4.53417 7.74786 4.20756 8.05588C3.9726 8.27765 3.72818 8.49047 3.47551 8.69263C3.24182 8.87993 3.01363 9.10285 2.68978 9.1045L2.69019 9.10567Z" fill="currentColor"/>
                      <path d="M7.87036 9.10567C7.86305 9.10558 7.85628 9.10574 7.84884 9.10526C7.82812 9.10457 7.80592 9.10222 7.78983 9.0899C7.75481 9.06362 7.76504 9.01034 7.77972 8.96862C7.93582 8.52544 8.23771 8.18017 8.51068 7.79866C8.78365 7.41714 9.04948 7.01367 9.26498 6.59226C9.59168 5.95438 9.94321 5.00818 9.86317 4.30464C9.76403 3.42752 9.22849 2.58576 8.70761 1.89555C8.5706 1.71389 7.70991 0.922658 7.7431 0.73448C7.79062 0.464118 8.64998 1.05424 8.78402 1.13789C10.3597 2.11502 11.5363 3.57618 11.0258 5.50449C11.0035 5.58856 10.9801 5.67214 10.9548 5.7555C10.8141 6.22345 10.6397 6.69259 10.3119 7.07999C10.0233 7.42154 9.71435 7.74786 9.38774 8.05588C9.15278 8.27765 8.90835 8.49047 8.65569 8.69263C8.422 8.87993 8.19381 9.10285 7.86996 9.1045L7.87036 9.10567Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Section 5: Come and Find Me - Blob Scroll */}
              <div
                ref={(el) => { if (el) sectionsRef.current[4] = el; }}
                className={`relative flex items-center justify-center bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <TherapiesBlobScroll
                  isActive={isBlobScrollActive}
                  onEdgeReached={handleBlobEdgeReached}
                  resetToStart={blobResetToStart}
                  resetToEnd={blobResetToEnd}
                  onCtaClick={handleOpenModalInitial}
                  onScrollLockChange={handleBlobScrollLockChange}
                />
              </div>

              {/* Section 6: Footer */}
              <div
                ref={(el) => { if (el) sectionsRef.current[5] = el; }}
                className={`relative ${sectionClass}`}
              >
                <Footer />
              </div>
            </>
          ) : (
            /* ===== DESKTOP LAYOUT ===== */
            <>
              {/* Section 1: Introduction */}
              <div
                ref={(el) => { if (el) sectionsRef.current[0] = el; }}
                className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <div className="max-w-full sm:max-w-[600px] lg:max-w-[723px] mx-auto text-center flex flex-col gap-4 sm:gap-5 lg:gap-6">
                  <h1
                    className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#645c42]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Therapies
                  </h1>
                  <p
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-none text-[#645c42] tracking-normal"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    Possibilities for Change
                  </p>
                  <div
                    className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center px-2"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-3 sm:mb-4">
                      Combining bodywork and energy healing modalities opens powerful possibilities for
                      healing—from acute and chronic illnesses to pain management, trauma release, and
                      recovery from abuse. These therapies support the transformation of patterns related to
                      loss, help dissolve blocks in relationships, assist in post-accident or post-surgical
                      integration, and bring awareness to inherited family dynamics that may still be
                      influencing your life.
                    </p>
                    <p>
                      Each session at Antar Pravaah is designed to meet you where you are, using natural
                      healing practices to support deep, lasting change.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Antar Smaran Process - Featured Card */}
              {antarSmaranProcess && (
                <div
                  ref={(el) => { if (el) sectionsRef.current[1] = el; }}
                  className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
                >
                  <div className="max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1347px] mx-auto w-full h-full">
                    <TherapyCard therapy={antarSmaranProcess} isVisible={aspCardVisible} onCtaClick={handleOpenModalInitial} />
                  </div>
                </div>
              )}

              {/* Section 3: Modalities Scroll Card */}
              <div
                ref={(el) => { if (el) sectionsRef.current[2] = el; }}
                className={`relative flex items-center justify-center px-4 sm:px-8 lg:px-12 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <ModalitiesScrollCard 
                  modalities={modalitiesContent} 
                  sectionTitle="Our Modalities"
                  isActive={isModalitiesScrollActive}
                  onEdgeReached={handleModalitiesEdgeReached}
                  resetToStart={modalitiesResetToStart}
                  resetToEnd={modalitiesResetToEnd}
                  onCtaClick={handleOpenModalCalendar}
                />
              </div>

              {/* Section 4: Not Sure + Find Your Path + CTA */}
              <div
                ref={(el) => { if (el) sectionsRef.current[3] = el; }}
                className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <div className="max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[800px] mx-auto flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
                  {/* Decorative divider at top */}
                  <div className="flex items-center justify-center">
                    <img 
                      src="/page_end_blob.svg" 
                      alt="" 
                      className="w-[100px] sm:w-[120px] lg:w-[140px] h-auto"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(83%) sepia(15%) saturate(630%) hue-rotate(7deg) brightness(95%) contrast(85%)'
                      }}
                    />
                  </div>

                  <h2
                    className="text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.0] text-[#645c42] px-4"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Not sure which therapy is right for you?
                  </h2>

                  <p
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#645c42] uppercase tracking-[2px] sm:tracking-[2.3px] lg:tracking-[2.56px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    Find your path
                  </p>

                  <p
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-[#645c42] max-w-full sm:max-w-[550px] lg:max-w-[640px] px-4"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    Every body speaks a different language. If you&apos;re unsure which modality will resonate
                    most deeply with you, we offer a complimentary 30-minute consultation to help guide you
                    to the therapy that will serve your healing journey best.
                  </p>

                  <div className="flex flex-col gap-2 sm:gap-3 mt-2">
                    <Button text="Schedule a Free Consultation" size="large" colors={therapiesButtonColors} onClick={handleOpenModalInitial} />
                  </div>
                </div>
              </div>

              {/* Section 5: Come and Find Me - Blob with word-by-word animation */}
              <div
                ref={(el) => { if (el) sectionsRef.current[4] = el; }}
                className={`relative flex items-center justify-center bg-[#f6edd0] overflow-hidden ${sectionClass}`}
              >
                <TherapiesBlobScroll
                  isActive={isDesktopBlobActive}
                  onEdgeReached={handleDesktopBlobEdgeReached}
                  onCtaClick={handleOpenModalInitial}
                  onScrollLockChange={handleBlobScrollLockChange}
                />
              </div>

              {/* Section 6: Footer */}
              <div
                ref={(el) => { if (el) sectionsRef.current[5] = el; }}
                className={`relative ${sectionClass}`}
              >
                <Footer />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Guided Journey Modal */}
      <GuidedJourneyModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        startAt={modalStartAt}
      />
    </>
  );
}
