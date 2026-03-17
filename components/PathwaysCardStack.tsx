'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import PathwayCard, { Pathway } from './PathwayCard';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

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
  // New scroll control props (following ModalitiesScrollCard pattern)
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
  /** Callback for first card CTA (opens modal) */
  onFirstCardCta?: () => void;
}

export default function PathwaysCardStack({ 
  cards, 
  title, 
  showPattern = false, 
  pathways,
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
  onFirstCardCta,
}: PathwaysCardStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Cooldown between card changes (prevents residual scroll)
  const scrollCooldown = 400;

  // Stable ref to animate function so it can be called from card edge callbacks
  const animateToIndexStable = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= cards.length) return;
    if (isAnimatingRef.current) return;
    const currentIndex = activeIndexRef.current;
    if (newIndex === currentIndex) return;
    isAnimatingRef.current = true;
    prevIndexRef.current = currentIndex;
    activeIndexRef.current = newIndex;
    setActiveIndex(newIndex);
    setTimeout(() => {
      isAnimatingRef.current = false;
      lastScrollTimeRef.current = Date.now();
    }, 600);
  }, [cards.length]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      // Lock scroll when card is expanded
      document.body.style.overflow = 'hidden';
      // Disable observer while card is expanded
      observerRef.current?.disable();
    } else {
      // Restore scroll when card is collapsed
      document.body.style.overflow = '';
      // Re-enable observer if section is active
      if (isActive) {
        setTimeout(() => observerRef.current?.enable(), 100);
      }
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Ensure scroll is restored on unmount
      document.body.style.overflow = '';
    };
  }, []);

  // Handle reset to start (when entering from above)
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    // Reset to first card
    activeIndexRef.current = 0;
    prevIndexRef.current = 0;
    setActiveIndex(0);
    lastScrollTimeRef.current = Date.now();
  }, [resetToStart, isClient]);

  // Handle reset to end (when entering from below)
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    // Reset to last card
    const lastIndex = cards.length - 1;
    activeIndexRef.current = lastIndex;
    prevIndexRef.current = lastIndex;
    setActiveIndex(lastIndex);
    lastScrollTimeRef.current = Date.now();
  }, [resetToEnd, isClient, cards.length]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive && !isCardExpanded) {
      // Add delay before enabling to prevent residual scroll from triggering
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive, isCardExpanded]);

  // Setup Observer-based scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!containerRef.current || cards.length < 2) return;

    const totalItems = cards.length;

    const animateToIndex = (newIndex: number, callback?: () => void) => {
      if (newIndex < 0 || newIndex >= totalItems) return;
      if (isAnimatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      if (newIndex === currentIndex) return;

      isAnimatingRef.current = true;
      prevIndexRef.current = currentIndex;
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      
      // Animation happens in the useEffect below
      // Set timeout to match animation duration
      setTimeout(() => {
        isAnimatingRef.current = false;
        lastScrollTimeRef.current = Date.now();
        callback?.();
      }, 600);
    };

    const handleScroll = (direction: 'up' | 'down') => {
      // Skip if card is expanded
      if (isCardExpanded) return;
      
      // Check cooldown to prevent residual scroll
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (isAnimatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      
      if (direction === 'down') {
        if (currentIndex < totalItems - 1) {
          animateToIndex(currentIndex + 1);
        } else {
          // At the end - notify parent to move to next section
          lastScrollTimeRef.current = now;
          onEdgeReached?.('end');
        }
      } else {
        if (currentIndex > 0) {
          animateToIndex(currentIndex - 1);
        } else {
          // At the start - notify parent to move to previous section
          lastScrollTimeRef.current = now;
          onEdgeReached?.('start');
        }
      }
    };

    // On desktop with pathways, PathwayCard handles scroll internally — only use Observer for mobile touch
    const observerType = (!isMobile && pathways) ? 'touch,pointer' : 'wheel,touch,pointer';

    // Create Observer for scroll handling - starts disabled
    const pathwaysObserver = Observer.create({
      type: observerType,
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    // Start disabled, will be enabled when isActive becomes true
    pathwaysObserver.disable();
    observerRef.current = pathwaysObserver;

    return () => {
      pathwaysObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, cards.length, onEdgeReached, isCardExpanded, isMobile, pathways]);

  // Animate card transitions when activeIndex changes
  useEffect(() => {
    if (!cardContainerRef.current) return;

    const cardElements = Array.from(
      cardContainerRef.current.querySelectorAll<HTMLElement>('.pathway-card-wrapper')
    );

    if (cardElements.length === 0) return;

    isAnimatingRef.current = true;

    // Determine scroll direction
    const isScrollingDown = activeIndex > prevIndexRef.current;
    const yStart = isScrollingDown ? 30 : -30;

    // Kill any existing animations
    cardElements.forEach((card) => {
      gsap.killTweensOf(card);
    });

    // Hide all cards except active
    cardElements.forEach((card, index) => {
      if (index !== activeIndex) {
        gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      }
    });

    // Animate in the active card with parallax effect
    const activeCard = cardElements[activeIndex];
    if (activeCard) {
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
    } else {
      isAnimatingRef.current = false;
    }
  }, [activeIndex]);

  // Handle edge reached from desktop PathwayCard inner scroll
  const handleCardEdgeReached = useCallback((edge: 'start' | 'end') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < scrollCooldown) return;
    lastScrollTimeRef.current = now;

    const currentIndex = activeIndexRef.current;
    if (edge === 'end') {
      if (currentIndex < cards.length - 1) {
        animateToIndexStable(currentIndex + 1);
      } else {
        onEdgeReached?.('end');
      }
    } else {
      if (currentIndex > 0) {
        animateToIndexStable(currentIndex - 1);
      } else {
        onEdgeReached?.('start');
      }
    }
  }, [cards.length, onEdgeReached, scrollCooldown, animateToIndexStable]);

  // Render cards with mobile-aware PathwayCard
  const renderCards = () => {
    if (pathways) {
      // Render PathwayCard directly for both mobile and desktop
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
              isMobile={isMobile}
              onExpandedChange={isMobile ? handleCardExpandedChange : undefined}
              onCtaClick={index === 0 ? onFirstCardCta : undefined}
              onEdgeReached={!isMobile ? handleCardEdgeReached : undefined}
            />
          </div>
        </div>
      ));
    }

    // Fallback: render pre-built cards (no scroll-through support)
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
      className="pathways-scroll-container relative w-full h-full flex flex-col items-center px-4 sm:px-6 lg:px-8"
      style={{
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

      {/* Section Title - inside container */}
      {title && (
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center w-full flex-shrink-0 z-10">
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
        className="relative w-full flex-1 flex items-center justify-center z-10"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1347px, 100%)',
          // Use available height minus title area
          maxHeight: isMobile ? 'calc(100% - 5rem)' : 'calc(100% - clamp(6rem, 12vh, 10rem))',
        }}
      >
        {renderCards()}
      </div>
    </div>
  );
}
