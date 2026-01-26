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
  const cardsSectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState(720);
  const [isClient, setIsClient] = useState(false);

  // Track when we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set responsive stage height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      const sm = window.innerWidth >= 640;
      const lg = window.innerWidth >= 1024;
      
      if (lg) {
        setStageHeight(600);
      } else if (sm) {
        setStageHeight(550);
      } else {
        setStageHeight(500);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isClient]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

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

    const cardsObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => tweenToLabel(tl.previousLabel(), false),
      onUp: () => tweenToLabel(tl.nextLabel(), true),
      onEnable(self) {
        // Freeze native scroll position (fixes momentum scrolling)
        const savedScroll = self.scrollY();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (self as any)._restoreScroll = () => self.scrollY(savedScroll);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.addEventListener('scroll', (self as any)._restoreScroll, { passive: false });
      },
      onDisable(self) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.removeEventListener('scroll', (self as any)._restoreScroll);
      },
    });

    cardsObserver.disable();

    // ScrollTrigger to pin the section and enable card observer
    const st = ScrollTrigger.create({
      id: 'WORK-CARDS-LOCK',
      trigger: cardsSection,
      pin: true,
      pinSpacing: false,
      start: 'top top+=180', // Account for header
      end: '+=100',
      onEnter: () => {
        if (!cardsObserver.isEnabled) cardsObserver.enable();
      },
      onEnterBack: () => {
        if (!cardsObserver.isEnabled) cardsObserver.enable();
      },
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      st.kill();
      cardsObserver.kill();
      tl.kill();
    };
  }, []);

  return (
    <Section
      id="work-together"
      className="relative w-full bg-[#f6edd0] overflow-hidden pb-8 sm:pb-10 lg:pb-12 pt-8 sm:pt-10 lg:pt-12"
    >
      {/* Subtle spiral background pattern */}
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
            transform: 'rotate(45deg)',
            filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
          }}
        />
        {/* <img
          src="/about_splash_vector.svg"
          alt=""
          className="absolute w-[580px] h-auto opacity-100"
          style={{ 
            bottom: '15%', 
            left: '5%', 
            transform: 'rotate(80deg)',
            filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
          }}
        />
        <img
          src="/about_splash_vector.svg"
          alt=""
          className="absolute w-[580px] h-auto opacity-100"
          style={{ 
            bottom: '10%', 
            right: '3%', 
            transform: 'rotate(-120deg)',
            filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
          }}
        /> */}
      </div>

      {/* Card stack container */}
      <div ref={cardsSectionRef} className="cards-section relative w-full bg-transparent py-8 sm:py-10 lg:py-12">

        {/* Header */}
        <div className="relative z-10 w-full text-center mb-6 lg:mb-8">
          <h2
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            We Work Together
          </h2>
        </div>

        <div className="relative z-10 w-full max-w-[95vw] lg:max-w-[1100px] px-4 mx-auto">
          {/* Stage: cards overlap here - all cards same width */}
          <div ref={stageRef} className="relative w-full" style={{ height: `${stageHeight}px` }}>
              {/* Card 01 - First card with image */}
              <div className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-8 lg:p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center gap-8 lg:gap-10 h-[500px] sm:h-[550px] lg:h-[600px]">
                <div className="flex justify-center items-center flex-shrink-0">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_one')}
                    alt=""
                    width={430}
                    height={450}
                    quality={85}
                    loading="lazy"
                    className="block w-[430px] h-[450px] sm:w-[430px] sm:h-[450px] lg:w-[430px] lg:h-[450px] object-contain"
                  />
                </div>
                <p
                  className="text-center text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.5] text-[#645c42] max-w-[85%] px-2"
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
                    className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center h-[500px] sm:h-[550px] lg:h-[600px]"
                  >
                    <div
                      className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10 w-full ${
                        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      <Image
                        src={imageSrc}
                        alt=""
                        width={200}
                        height={200}
                        quality={85}
                        loading="lazy"
                        className="block w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] flex-shrink-0 object-contain"
                      />
                      <p
                        className="flex-1 text-justify text-[13px] sm:text-[14px] lg:text-[16px] leading-[1.5] text-[#645c42] px-2"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card (part of the stack; final card) - same fixed width */}
              <div className="card absolute left-0 right-0 top-0 mx-auto flex w-full items-center justify-center rounded-[20px] lg:rounded-[24px] bg-[#645c42] p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] h-[500px] sm:h-[550px] lg:h-[600px]">
                <Button text="Explore Our Approach" size="large" mode="light" href="/approach" />
              </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

