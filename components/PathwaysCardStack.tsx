'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PathwayCard, { Pathway } from './PathwayCard';

gsap.registerPlugin(ScrollTrigger);

export interface PathwaysStackCard {
  key: string;
  render: React.ReactNode;
}

interface PathwaysCardStackProps {
  cards: PathwaysStackCard[];
  /** Section title shown above the cards */
  title?: string;
  /** Show pattern background (pinned with section) */
  showPattern?: boolean;
  /** Pathways data for mobile layout */
  pathways?: Pathway[];
}

export default function PathwaysCardStack({ cards, title, showPattern = false, pathways }: PathwaysCardStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

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

  // Handle card expansion state changes - lock scroll when expanded
  const handleCardExpandedChange = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded);
    
    if (expanded) {
      // Pause Lenis smooth scroll when card is expanded
      if (typeof window !== 'undefined' && (window as Window & { __lenis?: { stop?: () => void } }).__lenis?.stop) {
        (window as Window & { __lenis?: { stop?: () => void } }).__lenis?.stop?.();
      }
    } else {
      // Resume Lenis smooth scroll when card is collapsed
      if (typeof window !== 'undefined' && (window as Window & { __lenis?: { start?: () => void } }).__lenis?.start) {
        (window as Window & { __lenis?: { start?: () => void } }).__lenis?.start?.();
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Ensure Lenis is restored on unmount
      if (typeof window !== 'undefined' && (window as Window & { __lenis?: { start?: () => void } }).__lenis?.start) {
        (window as Window & { __lenis?: { start?: () => void } }).__lenis?.start?.();
      }
    };
  }, []);

  // Setup scroll-driven card changes - BOTH desktop AND mobile (pinned behavior)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !cardContainerRef.current || cards.length < 2) return;

    const container = containerRef.current;
    const totalItems = cards.length;

    // Scroll distance per card - slightly less on mobile for faster transitions
    const scrollPerItem = isMobile ? window.innerHeight * 0.4 : window.innerHeight * 0.5;
    const totalScrollDistance = scrollPerItem * (totalItems - 1);

    // Create ScrollTrigger for pinning and progress tracking
    const st = ScrollTrigger.create({
      trigger: container,
      start: isMobile ? 'top top+=100' : 'top top+=160',
      end: `+=${totalScrollDistance}`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        // Don't update if card is expanded (prevents scroll while reading)
        if (isCardExpanded) return;
        
        // Calculate which card should be active based on scroll progress
        const progress = self.progress;
        const newIndex = Math.min(
          Math.floor(progress * totalItems),
          totalItems - 1
        );

        // Update index without triggering re-render loop
        if (newIndex !== activeIndexRef.current && !isAnimatingRef.current) {
          prevIndexRef.current = activeIndexRef.current;
          activeIndexRef.current = newIndex;
          setActiveIndex(newIndex);
        }
      },
    });

    scrollTriggerRef.current = st;

    // Refresh after mount
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [cards.length, isMobile, isCardExpanded]);

  // Animate card transitions when activeIndex changes
  useEffect(() => {
    if (!cardContainerRef.current) return;

    const cardElements = Array.from(
      cardContainerRef.current.querySelectorAll<HTMLElement>('.pathway-card-wrapper')
    );

    if (cardElements.length === 0) return;

    isAnimatingRef.current = true;

    // Hide all cards
    cardElements.forEach((card, index) => {
      if (index !== activeIndex) {
        gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      }
    });

    // Animate in the active card
    const activeCard = cardElements[activeIndex];
    if (activeCard) {
      const isScrollingDown = activeIndex > prevIndexRef.current;
      const yStart = isScrollingDown ? 30 : -30;

      gsap.fromTo(
        activeCard,
        {
          opacity: 0,
          y: yStart,
          pointerEvents: 'none',
        },
        {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        }
      );
    }
  }, [activeIndex]);

  // Render cards with mobile-aware PathwayCard
  const renderCards = () => {
    if (isMobile && pathways) {
      // On mobile, render PathwayCard directly with mobile props
      return pathways.map((pathway, index) => (
        <div
          key={pathway.id}
          className="pathway-card-wrapper absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            opacity: index === 0 ? 1 : 0,
            pointerEvents: index === 0 ? 'auto' : 'none',
          }}
        >
          <div className="w-full h-full max-h-full">
            <PathwayCard
              pathway={pathway}
              isMobile={true}
              onExpandedChange={handleCardExpandedChange}
            />
          </div>
        </div>
      ));
    }

    // Desktop: render pre-built cards
    return cards.map((card, index) => (
      <div
        key={card.key}
        className="pathway-card-wrapper absolute inset-0 w-full h-full flex items-center justify-center"
        style={{
          opacity: index === 0 ? 1 : 0,
          pointerEvents: index === 0 ? 'auto' : 'none',
        }}
      >
        <div className="w-full h-full max-h-full">
          {card.render}
        </div>
      </div>
    ));
  };

  return (
    <div 
      ref={containerRef} 
      className="pathways-scroll-container relative w-full flex flex-col items-center px-4 sm:px-6 lg:px-8"
      style={{
        // Account for header + padding, fit within viewport
        minHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 160px)',
        paddingTop: isMobile ? '1rem' : 'clamp(1.5rem, 3vh, 2.5rem)',
        paddingBottom: isMobile ? '1rem' : 'clamp(1.5rem, 3vh, 2.5rem)',
      }}
    >
      {/* Pattern background - CSS Grid for precise spacing control */}
      {showPattern && (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ opacity: isMobile ? 0.15 : 0.12 }}
        >
          <div
            className="absolute inset-0"
            style={isMobile ? {
              backgroundImage: 'url(/approach_blob.svg)',
              backgroundSize: '100px 100px',
              backgroundRepeat: 'repeat',
            } : {
              display: 'grid',
              placeContent: 'center',
              gridTemplateColumns: 'repeat(auto-fill, 180px)',
              gridTemplateRows: 'repeat(auto-fill, 180px)',
              gap: '100px',
              padding: '20px',
              width: 'calc(100% + 200px)',
              height: 'calc(100% + 200px)',
              marginLeft: '-100px',
              marginTop: '-100px',
            }}
          >
            {!isMobile && Array.from({ length: 80 }).map((_, i) => (
              <img
                key={i}
                src="/approach_blob.svg"
                alt=""
                className="w-[180px] h-[180px] object-contain"
              />
            ))}
          </div>
        </div>
      )}

      {/* Section Title - inside pinned container */}
      {title && (
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center w-full flex-shrink-0">
          <h2
            className="text-[36px] md:text-[clamp(2rem,5vw,3rem)] leading-[1.0] text-[#9ac1bf] whitespace-pre-line md:whitespace-normal"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {isMobile ? title.replace(' for ', '\nfor ') : title}
          </h2>
        </div>
      )}

      {/* Card Container - flexbox to fill remaining space */}
      <div
        ref={cardContainerRef}
        className="relative w-full flex-1 flex items-center justify-center"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1347px, 100%)',
          // Use available height minus title area
          maxHeight: isMobile ? 'calc(100vh - 100px - 5rem)' : 'calc(100vh - 160px - clamp(6rem, 12vh, 10rem))',
        }}
      >
        {renderCards()}
      </div>
    </div>
  );
}
