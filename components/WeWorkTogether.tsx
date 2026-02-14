'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from './Button';
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface WeWorkTogetherProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

const workCards = [
  {
    text: "At Antar Pravaah, healing is a shared responsibility. We both do the work.",
    imagePosition: 'center' as const,
    isIntro: true,
  },
  {
    text: "Transformation demands commitment and persistence. It's not force, it's flow, but even in that, the commitment to follow the flow is integral to the work.",
    imagePosition: 'right' as const,
  },
  {
    text: "Very often we start with the desire to change everything; we want to fix everything that is not working and bring forth a new version sans the problems of the past. I have been doing this work for 20 years, and I can tell you with a fair bit of certainty, it rarely works.",
    imagePosition: 'left' as const,
  },
  {
    text: 'Why? Because we do want change but often change to the extent of the outermost limits of our own comfort zone. Healing or transformation works when you are willing to take the baby steps out of your comfortable space and step into the unfamiliar.',
    imagePosition: 'right' as const,
  },
];

// Total cards: 4 content cards + 1 CTA = 5
const TOTAL_CARDS = workCards.length + 1;

export default function WeWorkTogether({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
}: WeWorkTogetherProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Cooldown between card changes
  const scrollCooldown = 400;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Handle reset to start (when entering from above)
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    // Reset to first card
    activeIndexRef.current = 0;
    prevIndexRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
    lastScrollTimeRef.current = Date.now();
    
    // Reset visual state
    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;
    
    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('.work-card'));
    cards.forEach((card, index) => {
      gsap.set(card, {
        autoAlpha: index === 0 ? 1 : 0,
        scale: index === 0 ? 1 : 0.95,
        y: index === 0 ? 0 : 30,
        pointerEvents: index === 0 ? 'auto' : 'none',
      });
    });
  }, [resetToStart, isClient]);

  // Handle reset to end (when entering from below)
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    // Reset to last card (CTA)
    const lastIndex = TOTAL_CARDS - 1;
    activeIndexRef.current = lastIndex;
    prevIndexRef.current = lastIndex;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(lastIndex);
    lastScrollTimeRef.current = Date.now();
    
    // Reset visual state
    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;
    
    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('.work-card'));
    cards.forEach((card, index) => {
      gsap.set(card, {
        autoAlpha: index === lastIndex ? 1 : 0,
        scale: index === lastIndex ? 1 : 0.95,
        y: index === lastIndex ? 0 : -20,
        pointerEvents: index === lastIndex ? 'auto' : 'none',
      });
    });
  }, [resetToEnd, isClient]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
      // Add delay before enabling to prevent residual scroll from triggering
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive]);

  // Animate card transition
  const animateToIndex = useCallback((newIndex: number, callback?: () => void) => {
    if (newIndex < 0 || newIndex >= TOTAL_CARDS) return;
    if (isAnimatingRef.current) return;
    
    const currentIndex = activeIndexRef.current;
    if (newIndex === currentIndex) return;

    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('.work-card'));
    if (cards.length === 0) return;

    isAnimatingRef.current = true;
    prevIndexRef.current = currentIndex;
    activeIndexRef.current = newIndex;
    setActiveIndex(newIndex);

    // Determine scroll direction
    const isScrollingDown = newIndex > currentIndex;
    const yStart = isScrollingDown ? 30 : -30;
    const yEnd = isScrollingDown ? -20 : 20;

    // Animate out current card
    const currentCard = cards[currentIndex];
    if (currentCard) {
      gsap.to(currentCard, {
        autoAlpha: 0,
        scale: 0.95,
        y: yEnd,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(currentCard, { pointerEvents: 'none' });
        },
      });
    }

    // Animate in new card
    const newCard = cards[newIndex];
    if (newCard) {
      gsap.fromTo(
        newCard,
        {
          autoAlpha: 0,
          scale: 0.95,
          y: yStart,
          pointerEvents: 'none',
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.1,
          onComplete: () => {
            isAnimatingRef.current = false;
            lastScrollTimeRef.current = Date.now();
            callback?.();
          },
        }
      );
    } else {
      isAnimatingRef.current = false;
      lastScrollTimeRef.current = Date.now();
    }
  }, []);

  // Handle scroll input
  const handleScroll = useCallback((direction: 'up' | 'down') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < scrollCooldown) return;
    if (isAnimatingRef.current) return;

    const currentIndex = activeIndexRef.current;

    if (direction === 'down') {
      if (currentIndex < TOTAL_CARDS - 1) {
        animateToIndex(currentIndex + 1);
      } else {
        // At the end - notify parent
        lastScrollTimeRef.current = now;
        onEdgeReached?.('end');
      }
    } else {
      if (currentIndex > 0) {
        animateToIndex(currentIndex - 1);
      } else {
        // At the start - notify parent
        lastScrollTimeRef.current = now;
        onEdgeReached?.('start');
      }
    }
  }, [animateToIndex, onEdgeReached]);

  // Setup Observer-based scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!cardsContainerRef.current) return;

    const cards = Array.from(cardsContainerRef.current.querySelectorAll<HTMLElement>('.work-card'));
    if (cards.length < 2) return;

    // Set initial states - all cards hidden except first
    cards.forEach((card, index) => {
      gsap.set(card, {
        autoAlpha: index === 0 ? 1 : 0,
        scale: index === 0 ? 1 : 0.95,
        y: index === 0 ? 0 : 30,
        pointerEvents: index === 0 ? 'auto' : 'none',
      });
    });

    // Create Observer for scroll handling - starts disabled
    const cardsObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    // Start disabled
    cardsObserver.disable();
    observerRef.current = cardsObserver;

    return () => {
      cardsObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, handleScroll]);

  // Get image sources
  const imageSrcs = [
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_one'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_two'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_three'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_four'),
  ];

  return (
    <div
      id="work-together"
      ref={containerRef}
      className="relative w-full h-full bg-[#f6edd0] overflow-hidden"
    >
      {/* Full height container */}
      <div className="relative w-full h-full flex flex-col">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/about_splash_vector.svg"
            alt=""
            className="absolute w-[400px] sm:w-[500px] lg:w-[580px] h-auto opacity-100"
            style={{
              top: '15%',
              left: '3%',
              filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
            }}
          />
          <img
            src="/about_splash_vector.svg"
            alt=""
            className="absolute w-[400px] sm:w-[500px] lg:w-[580px] h-auto opacity-100"
            style={{
              top: '25%',
              right: '3%',
              transform: 'rotate(45deg)',
              filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
            }}
          />
        </div>

        {/* Section Title */}
        <div className="relative z-10 w-full text-center pt-4 sm:pt-8 lg:pt-12 pb-3 sm:pb-6 lg:pb-8 flex-shrink-0">
          <h2
            className="text-[28px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            We Work Together
          </h2>
        </div>

        {/* Cards Container - Centered in remaining viewport */}
        <div 
          ref={cardsContainerRef}
          className="relative z-10 flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12"
        >
          <div className="relative w-full h-full sm:h-auto sm:max-w-[90vw] lg:max-w-[1000px]">
            {/* Card Stack - All cards positioned absolutely */}
            <div 
              className="relative w-full h-full sm:h-[clamp(350px,55vh,550px)]"
            >
              {/* Intro Card */}
              <div 
                className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden ios-radius-fix bg-[#d6c68e] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10"
              >
                <div className="flex items-center justify-center">
                  <Image
                    src={imageSrcs[0]}
                    alt=""
                    width={430}
                    height={450}
                    quality={85}
                    loading="lazy"
                    className="w-auto h-auto max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px] lg:max-w-[380px] lg:max-h-[380px] object-contain"
                  />
                </div>
                <p
                  className="text-center text-[15px] sm:text-[15px] lg:text-[16px] leading-[1.5] text-[#645c42] max-w-[90%] px-4"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  {workCards[0].text}
                </p>
              </div>

              {/* Content Cards */}
              {workCards.slice(1).map((card, index) => {
                const isLeft = card.imagePosition === 'left';
                const imageSrc = imageSrcs[index + 1] || imageSrcs[1];
                
                return (
                  <div
                    key={index}
                    className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden ios-radius-fix bg-[#d6c68e] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center"
                  >
                    <div
                      className={`flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 w-full h-full justify-center ${
                        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt=""
                          width={430}
                          height={450}
                          quality={85}
                          loading="lazy"
                          className="w-auto h-auto max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px] lg:max-w-[380px] lg:max-h-[380px] object-contain"
                        />
                      </div>
                      <p
                        className="flex-1 text-center sm:text-justify text-[15px] sm:text-[15px] lg:text-[16px] leading-[1.5] text-[#645c42] px-2 sm:px-4"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card */}
              <Link
                href="/approach"
                className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden ios-radius-fix bg-[#645c42] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer hover:bg-[#555141] transition-colors duration-300 group"
              >
                <div className="pointer-events-none">
                  <Button text="Explore Our Approach" size="large" mode="light" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
