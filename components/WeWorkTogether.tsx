'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';
import Section from './Section';
import Button from './Button';
import { getCloudinaryUrl } from '@/lib/cloudinary';

const workCards = [
  {
    text: "Transformation demands commitment and persistence. It’s not force, it’s flow, but even in that, the commitment to follow the flow is integral to the work.",
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

export default function WeWorkTogether() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsSectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState(600);
  const [isReady, setIsReady] = useState(false);

  // Calculate stage height on mount and window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateHeight = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const sm = window.innerWidth >= 640;
      const lg = window.innerWidth >= 1024;

      if (lg) {
        return 600;
      } else if (sm) {
        return Math.min(vh - 250, 550);
      } else {
        // Mobile: leave more space for header
        const mobileHeight = vh - 200;
        return Math.min(Math.max(mobileHeight, 400), 600);
      }
    };

    // Set initial height
    setStageHeight(calculateHeight());

    // Small delay to ensure DOM is ready before marking as ready
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    const handleResize = () => {
      const newHeight = calculateHeight();
      setStageHeight(newHeight);
      // Trigger ScrollTrigger refresh after height changes
      if (isReady) {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(readyTimeout);
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [isReady]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    // Wait until component is ready (height calculated, DOM rendered)
    if (!isReady) return;

    gsap.registerPlugin(ScrollTrigger, Observer);

    const cardsSection = cardsSectionRef.current;
    if (!cardsSection) return;

    const cards = Array.from(cardsSection.querySelectorAll<HTMLElement>('.card'));
    if (cards.length < 2) return;

    const time = 0.95; // Slower animation timing for smoother feel (matching therapies)
    let animating = false;

    // Single-card focus layout: only one card is visible at a time.
    gsap.set(cards, {
      autoAlpha: 0,
      y: 0,
      scale: 1,
      transformOrigin: 'center top',
      zIndex: 1,
    });
    gsap.set(cards[0], { autoAlpha: 1, zIndex: cards.length + 10 });

    const tl = gsap.timeline({ paused: true });

    // Get text elements for each card to animate them separately
    const getCardTextElements = (card: HTMLElement) => {
      return {
        image: card.querySelector('img'),
        text: card.querySelector('p'),
        button: card.querySelector('button, a'),
      };
    };

    // Set initial state for first card's text elements
    const firstCardText = getCardTextElements(cards[0]);
    const firstCardElements = [firstCardText.image, firstCardText.text, firstCardText.button].filter(Boolean);
    if (firstCardElements.length > 0) {
      gsap.set(firstCardElements, { autoAlpha: 1 });
    }

    // Build labels: card2, card3, ...
    for (let i = 0; i < cards.length - 1; i++) {
      tl.add(`card${i + 2}`);
      const current = cards[i];
      const next = cards[i + 1];
      const currentText = getCardTextElements(current);
      const nextText = getCardTextElements(next);

      // Filter out null elements
      const currentElements = [currentText.image, currentText.text, currentText.button].filter(Boolean);
      const nextImageText = [nextText.image, nextText.text].filter(Boolean);

      // All text fades out together with slight stagger for organic feel
      if (currentElements.length > 0) {
        tl.to(currentElements, {
          autoAlpha: 0,
          y: -8,
          duration: time * 0.5,
          ease: 'power2.inOut',
        });
      }

      // Card container fades out while text is fading
      tl.to(current, {
        scale: 0.96,
        autoAlpha: 0,
        duration: time * 0.5,
        ease: 'power2.inOut',
      }, '<0.1');

      // Next card setup and slide in - starts before current fully fades
      tl.set(next, { zIndex: cards.length + i + 20, autoAlpha: 1 }, '<0.2');
      if (nextImageText.length > 0) {
        tl.set(nextImageText, { autoAlpha: 0, y: 12 }, '<');
      }
      if (nextText.button) {
        tl.set(nextText.button, { autoAlpha: 0, y: 10 }, '<');
      }

      tl.fromTo(
        next,
        { y: () => window.innerHeight * 0.15 },
        { y: 0, duration: time * 0.55, ease: 'power2.out', immediateRender: false },
        '<'
      );

      // Text fades in as card settles - all together for cohesion
      if (nextText.image) {
        tl.to([nextText.image], {
          autoAlpha: 1,
          y: 0,
          duration: time * 0.5,
          ease: 'power2.out',
        }, '<0.1');
      }
      if (nextText.text) {
        tl.to([nextText.text], {
          autoAlpha: 1,
          y: 0,
          duration: time * 0.5,
          ease: 'power2.out',
        }, '<0.03');
      }
      if (nextText.button) {
        tl.to([nextText.button], {
          autoAlpha: 1,
          y: 0,
          duration: time * 0.5,
          ease: 'power2.out',
        }, '<0.05');
      }
    }
    tl.add(`card${cards.length + 1}`);

    const tweenToLabel = (direction: string | null, isScrollingDown: boolean) => {
      const next = tl.nextLabel();
      const prev = tl.previousLabel();

      // At the end and user scrolls down -> release scroll
      if ((!next && isScrollingDown) || (!prev && !isScrollingDown)) {
        cardsObserver.disable();
        return;
      }
      if (!direction) return;
      if (animating) return;
      animating = true;
      tl.tweenTo(direction, {
        duration: time, // Explicit duration for consistent speed in both directions
        ease: 'power2.inOut',
        onComplete: () => {
          animating = false;
        },
      });
    };

    // Improved Observer with better mobile handling
    const isMobileDevice = window.innerWidth < 640;

    const cardsObserver = Observer.create({
      target: cardsSection,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: isMobileDevice ? 25 : 15,
      preventDefault: true,
      dragMinimum: isMobileDevice ? 30 : 20,
      onDown: () => tweenToLabel(tl.previousLabel(), false),
      onUp: () => tweenToLabel(tl.nextLabel(), true),
      onEnable() {
        // Pause Lenis smooth scroll when Observer takes control
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__lenis?.stop?.();
      },
      onDisable() {
        // Resume Lenis when done
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__lenis?.start?.();
      },
    });

    cardsObserver.disable();

    // ScrollTrigger to pin the section and enable card observer
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    // Calculate end value based on number of cards and viewport
    // We have 5 total cards, so 4 transitions between them
    // Keep the scroll distance reasonable - just enough for smooth transitions
    const scrollDistancePerCard = isMobile ? 150 : isTablet ? 200 : 250;
    const totalScrollDistance = cards.length * scrollDistancePerCard;

    const st = ScrollTrigger.create({
      id: 'WORK-CARDS-LOCK',
      trigger: containerRef.current,
      pin: cardsSection,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: false,
      // Start pinning when the section header reaches near top
      start: isMobile ? 'top 10%' : 'top 12%',
      // End after all cards have been shown
      end: `+=${totalScrollDistance}`,
      invalidateOnRefresh: true,
      onEnter: () => {
        cardsObserver.enable();
      },
      onEnterBack: () => {
        cardsObserver.enable();
      },
      onLeave: () => {
        cardsObserver.disable();
      },
      onLeaveBack: () => {
        cardsObserver.disable();
      },
    });

    // Refresh after DOM has updated with new heights
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);

    return () => {
      clearTimeout(refreshTimeout);
      st.kill();
      cardsObserver.kill();
      tl.kill();
      // Ensure Lenis is resumed on cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis?.start?.();
    };
  }, [isReady]);

  return (
    <Section
      id="work-together"
      className="relative w-full bg-[#f6edd0]"
    >
      {/* Trigger container - ScrollTrigger watches this */}
      <div ref={containerRef} className="relative w-full pt-6 sm:pt-10 lg:pt-12 pb-4 sm:pb-10 lg:pb-12">
        {/* Card stack container - this gets pinned */}
        <div ref={cardsSectionRef} className="cards-section relative w-full bg-[#f6edd0]">
          {/* Subtle spiral background pattern - now inside pinned section */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img
              src="/about_splash_vector.svg"
              alt=""
              className="absolute w-[580px] h-auto opacity-100"
              style={{
                top: '20%',
                left: '5%',
                filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
              }}
            />
            <img
              src="/about_splash_vector.svg"
              alt=""
              className="absolute w-[580px] h-auto opacity-100"
              style={{
                top: '30%',
                right: '5%',
                transform: 'rotate(45 deg)',
                filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
              }}
            />
          </div>

          {/* Header - included in pinned section */}
          <div className="relative z-10 w-full text-center mb-6 sm:mb-8 lg:mb-10 pt-2">
            <h2
              className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#645c42]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              We Work Together
            </h2>
          </div>

          <div className="relative z-10 w-full max-w-[100vw] sm:max-w-[95vw] lg:max-w-[1100px] px-3 sm:px-4 mx-auto">
          {/* Stage: cards overlap here - all cards same width */}
          <div ref={stageRef} className="relative w-full" style={{ height: `${stageHeight}px` }}>
              {/* Card 01 - First card with image */}
              <div className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-4 sm:p-8 lg:p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-3 sm:gap-8 lg:gap-10" style={{ height: `${stageHeight}px` }}>
                <div className="flex justify-center items-center flex-shrink-0 flex-1 max-h-[60%] sm:max-h-[70%]">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_one')}
                    alt=""
                    width={430}
                    height={450}
                    quality={85}
                    loading="lazy"
                    className="block w-auto h-full max-w-[260px] sm:max-w-[380px] lg:max-w-[430px] object-contain"
                  />
                </div>
                <p
                  className="text-center text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.5] text-[#645c42] max-w-[95%] sm:max-w-[85%] px-2 sm:px-2 flex-shrink-0"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  At Antar Pravaah, healing is a shared responsibility. We both do the work.
                </p>
              </div>

              {/* Cards 02-04 - all same fixed width */}
              {workCards.map((card, index) => {
                const isLeft = card.imagePosition === 'left';
                const smallCardSrcs = [
                  getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_two'),
                  getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_three'),
                  getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_four')
                ];
                const imageSrc = smallCardSrcs[index] ?? smallCardSrcs[0];
                return (
                  <div
                    key={index}
                    className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-4 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center"
                    style={{ height: `${stageHeight}px` }}
                  >
                    <div
                      className={`flex flex-col items-center gap-3 sm:gap-6 lg:gap-10 w-full h-full justify-center ${
                        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt=""
                          width={200}
                          height={200}
                          quality={85}
                          loading="lazy"
                          className="block w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] object-contain"
                        />
                      </div>
                      <p
                        className="flex-1 text-justify text-[13px] sm:text-[14px] lg:text-[16px] leading-[1.5] sm:leading-[1.6] text-[#645c42] px-2 sm:px-2"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card (part of the stack; final card) - same fixed width */}
              <div className="card absolute left-0 right-0 top-0 mx-auto flex w-full items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#645c42] p-4 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]" style={{ height: `${stageHeight}px` }}>
                <Button text="Explore Our Approach" size="large" mode="light" href="/approach" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

