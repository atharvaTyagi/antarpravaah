'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
}

export default function PathwaysCardStack({ cards, title, showPattern = false }: PathwaysCardStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // Setup scroll-driven card changes (similar to ModalitiesScrollCard)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !cardContainerRef.current || cards.length < 2) return;

    const container = containerRef.current;
    const totalItems = cards.length;

    // Scroll distance per card
    const scrollPerItem = window.innerHeight * 0.5;
    const totalScrollDistance = scrollPerItem * (totalItems - 1);

    // Create ScrollTrigger for pinning and progress tracking
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top+=160',
      end: `+=${totalScrollDistance}`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
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

    // Refresh after mount
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      st.kill();
    };
  }, [cards.length]);

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

  return (
    <div 
      ref={containerRef} 
      className="pathways-scroll-container relative w-full flex flex-col items-center px-4 sm:px-6 lg:px-8"
      style={{
        // Account for header (160px) + padding, fit within viewport
        minHeight: 'calc(100vh - 160px)',
        paddingTop: 'clamp(1.5rem, 3vh, 2.5rem)',
        paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
      }}
    >
      {/* Pattern background - CSS Grid for precise spacing control */}
      {showPattern && (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{ opacity: 0.12 }}
        >
          <div
            className="absolute inset-0 grid place-content-center"
            style={{
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
            {Array.from({ length: 80 }).map((_, i) => (
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
            className="text-[clamp(2rem,5vw,3rem)] leading-[1.0] text-[#9ac1bf]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Card Container - flexbox to fill remaining space */}
      <div
        ref={cardContainerRef}
        className="relative w-full flex-1 flex items-center justify-center"
        style={{
          maxWidth: 'min(1347px, 100%)',
          // Use available height minus title area
          maxHeight: 'calc(100vh - 160px - clamp(6rem, 12vh, 10rem))',
        }}
      >
        {cards.map((card, index) => (
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
        ))}
      </div>
    </div>
  );
}
