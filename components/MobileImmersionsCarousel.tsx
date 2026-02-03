'use client';

import React, { useLayoutEffect, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Arrow icons for carousel navigation
function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="21"
      viewBox="0 0 28 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z"
        fill="currentColor"
      />
      <path
        d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="21"
      viewBox="0 0 28 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M18.33 9.10567C18.3223 9.10558 18.3156 9.10574 18.3081 9.10526C18.2874 9.10457 18.2652 9.10222 18.2491 9.0899C18.2141 9.06362 18.2243 9.01034 18.239 8.96862C18.3951 8.52544 18.697 8.18017 18.9699 7.79866C19.2429 7.41714 19.5087 7.01367 19.7242 6.59226C20.0509 5.95438 20.4025 5.00818 20.3224 4.30464C20.2233 3.42752 19.6877 2.58576 19.1669 1.89555C19.0298 1.71389 18.1692 0.922658 18.2023 0.73448C18.2499 0.464118 19.1092 1.05424 19.2433 1.13789C20.8189 2.11502 21.9955 3.57618 21.4851 5.50449C21.4627 5.58856 21.4393 5.67214 21.414 5.7555C21.2733 6.22345 21.0989 6.69259 20.7711 7.07999C20.4825 7.42154 20.1736 7.74786 19.847 8.05588C19.612 8.27765 19.3676 8.49047 19.1149 8.69263C18.8812 8.87993 18.653 9.10285 18.3292 9.1045L18.33 9.10567Z"
        fill="currentColor"
      />
      <path
        d="M23.5102 9.10567C23.5025 9.10558 23.4957 9.10574 23.4883 9.10526C23.4676 9.10457 23.4454 9.10222 23.4293 9.0899C23.3943 9.06362 23.4045 9.01034 23.4192 8.96862C23.5753 8.52544 23.8772 8.18017 24.1501 7.79866C24.4231 7.41714 24.6889 7.01367 24.9044 6.59226C25.2311 5.95438 25.5827 5.00818 25.5026 4.30464C25.4035 3.42752 24.8679 2.58576 24.3471 1.89555C24.21 1.71389 23.3494 0.922658 23.3825 0.73448C23.4301 0.464118 24.2894 1.05424 24.4235 1.13789C25.9991 2.11502 27.1757 3.57618 26.6653 5.50449C26.6429 5.58856 26.6195 5.67214 26.5942 5.7555C26.4535 6.22345 26.2791 6.69259 25.9513 7.07999C25.6627 7.42154 25.3538 7.74786 25.0272 8.05588C24.7922 8.27765 24.5478 8.49047 24.2951 8.69263C24.0614 8.87993 23.8332 9.10285 23.5094 9.1045L23.5102 9.10567Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface MobileImmersionsCarouselProps {
  title: string | ReactNode;
  children: ReactNode[];
  id: string;
  /** Callback when any card's expanded state changes */
  onCardExpandedChange?: (expanded: boolean) => void;
}

export default function MobileImmersionsCarousel({
  title,
  children,
  id,
  onCardExpandedChange,
}: MobileImmersionsCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (children.length === 0) return;
    
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(readyTimeout);
    };
  }, [children.length]);

  // Handle card expanded change - lock/unlock scroll
  const handleCardExpandedChange = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded);
    onCardExpandedChange?.(expanded);
    
    if (expanded) {
      // Lock scroll when card is expanded
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when card is collapsed
      document.body.style.overflow = '';
    }
  }, [onCardExpandedChange]);

  // Setup horizontal scroll animation with snap to each card (mobile only)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady || !isMobile) return;
    if (children.length === 0) return;

    const container = containerRef.current;
    const carousel = carouselRef.current;
    if (!container || !carousel) return;

    // Wait for layout to settle
    const setupTimeout = setTimeout(() => {
      const cards = carousel.querySelectorAll('.carousel-card');
      const cardCount = cards.length;
      
      if (cardCount === 0) return;
      
      // Calculate total horizontal scroll distance
      const scrollWidth = carousel.scrollWidth - window.innerWidth + 40;

      // Create timeline for horizontal scroll
      const tl = gsap.timeline();
      
      tl.to(carousel, {
        x: -scrollWidth,
        ease: 'none',
      });

      // Create snap points for each card (equally distributed)
      const snapPoints = Array.from({ length: cardCount }, (_, i) => i / (cardCount - 1));

      // Get header height for proper positioning
      const headerHeight = 90;
      
      // Create horizontal scroll animation with snap
      const st = ScrollTrigger.create({
        id: `${id}-CAROUSEL`,
        trigger: container,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        animation: tl,
        start: `top top+=${headerHeight}`,
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.2, max: 0.4 },
          delay: 0.1,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          // Don't update if card is expanded (prevents scroll while reading)
          if (isCardExpanded) return;
          
          // Update active index based on progress
          const progress = self.progress;
          const newIndex = Math.min(
            Math.floor(progress * cardCount),
            cardCount - 1
          );
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        },
      });

      scrollTriggerRef.current = st;

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();

      return () => {
        st.kill();
        tl.kill();
      };
    }, 300);

    return () => {
      clearTimeout(setupTimeout);
      // Clean up ScrollTriggers for this component
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id === `${id}-CAROUSEL`) {
          st.kill();
        }
      });
    };
  }, [isReady, isMobile, children.length, id, isCardExpanded, activeIndex]);

  // Desktop layout - simple horizontal scroll
  if (!isMobile) {
    return (
      <div className="flex flex-col gap-6 sm:gap-8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-16">
          <div
            className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {title}
          </div>
        </div>

        <div className="no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-16">
          {children}
        </div>
      </div>
    );
  }

  // Mobile layout - pinned horizontal scroll carousel
  return (
    <div 
      ref={containerRef}
      className="relative w-full flex flex-col justify-start overflow-hidden"
      style={{ 
        minHeight: 'calc(100vh - 90px)',
        height: 'calc(100vh - 90px)',
      }}
    >
      {/* Header with title and nav arrows */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 shrink-0">
        <div
          className="text-[24px] leading-normal text-[#d58761] flex-1"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {title}
        </div>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-0">
          <button 
            className="p-3 text-[#d58761] opacity-60"
            aria-label="Previous"
          >
            <ArrowLeft className="w-7 h-5 rotate-180" />
          </button>
          <button 
            className="p-3 text-[#d58761]"
            aria-label="Next"
          >
            <ArrowRight className="w-7 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="flex-1 flex items-center w-full px-4 overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-4 will-change-transform"
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="carousel-card shrink-0"
              style={{
                width: 'calc(100vw - 32px)',
              }}
            >
              {/* Clone child and inject onExpandedChange prop */}
              {React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<{ onExpandedChange?: (expanded: boolean) => void }>, { onExpandedChange: handleCardExpandedChange })
                : child
              }
            </div>
          ))}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="pb-4 shrink-0" />
    </div>
  );
}
