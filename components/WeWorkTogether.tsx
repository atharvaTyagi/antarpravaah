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

  // Calculate stage height based on tallest card
  useEffect(() => {
    if (!stageRef.current) return;
    const cardElements = stageRef.current.querySelectorAll<HTMLElement>('.card');
    let maxHeight = 720;
    cardElements.forEach((card) => {
      const height = card.offsetHeight;
      if (height > maxHeight) maxHeight = height;
    });
    setStageHeight(maxHeight);
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

    const st = ScrollTrigger.create({
      id: 'WORK-CARDS-LOCK',
      trigger: cardsSection,
      pin: true,
      // Start when the card stack is comfortably below fixed headers (main header 148px + subheader ~70px)
      start: 'top top+=230',
      // Short end – once Observer releases, native scroll continues and unpins quickly.
      end: '+=120',
      onEnter: () => {
        if (!cardsObserver.isEnabled) cardsObserver.enable();
      },
      onEnterBack: () => {
        if (!cardsObserver.isEnabled) cardsObserver.enable();
      },
    });

    // Ensure calculations are correct after layout.
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
      className="relative min-h-screen w-full bg-[#f6edd0] pb-16 sm:pb-20 lg:pb-24 pt-[60px] sm:pt-[76px] lg:pt-[96px] overflow-hidden"
    >
      {/* Subtle repeating spiral background - larger and well-spaced, smaller on mobile */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0">
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute hidden sm:block w-[25%] h-auto"
          style={{ top: '5%', left: '5%', transform: 'rotate(15deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute w-[15%] sm:w-[12%] h-auto"
          style={{ top: '8%', right: '8%', transform: 'rotate(-60deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute hidden sm:block w-[26%] h-auto"
          style={{ bottom: '30%', left: '10%', transform: 'rotate(85deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute hidden lg:block w-[24%] h-auto"
          style={{ bottom: '25%', right: '12%', transform: 'rotate(-120deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute w-[17%] sm:w-[14%] h-auto"
          style={{ bottom: '5%', left: '50%', transform: 'translate(-50%, 0) rotate(40deg)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        {/* GSAP card lock + stack */}
        <div ref={cardsSectionRef} className="cards-section relative w-full">
          {/* Keep width consistent with other sections (same max-w wrapper as page content). */}
          <div className="relative w-full">
            {/* Stage: cards overlap here */}
            <div ref={stageRef} className="relative w-full" style={{ height: `${stageHeight}px` }}>
              {/* Card 01 */}
              <div className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-6 sm:p-8 lg:p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-center">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/we-work/antarpravaah/we-work/we_work_together_vector_one')}
                    alt=""
                    width={431}
                    height={452}
                    quality={85}
                    loading="lazy"
                    className="block h-auto w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[431px] object-contain"
                  />
                </div>
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-[normal] text-[#645c42] px-2"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  At Antar Pravaah, healing is a shared responsibility. We both do the work.
                </p>
              </div>

              {/* Cards 02-04 */}
              {workCards.map((card, index) => {
                const isLeft = card.imagePosition === 'left';
                const smallCardSrcs = [
                  getCloudinaryUrl('antarpravaah/we-work/antarpravaah/we-work/we_work_together_vector_two'),
                  getCloudinaryUrl('antarpravaah/we-work/antarpravaah/we-work/we_work_together_vector_three'),
                  getCloudinaryUrl('antarpravaah/we-work/antarpravaah/we-work/we_work_together_vector_four')
                ];
                const imageSrc = smallCardSrcs[index] ?? smallCardSrcs[0];
                return (
                  <div
                    key={index}
                    className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  >
                    <div
                      className={`flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 md:flex-row ${
                        isLeft ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      <Image
                        src={imageSrc}
                        alt=""
                        width={258}
                        height={272}
                        quality={85}
                        loading="lazy"
                        className="block h-auto w-full max-w-[180px] sm:max-w-[220px] lg:max-w-[258px] shrink-0 object-contain"
                      />
                      <p
                        className="flex-1 text-justify text-[18px] sm:text-[20px] lg:text-[24px] leading-[normal] text-[#645c42]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card (part of the stack; final card) */}
              <div className="card absolute left-0 right-0 top-0 mx-auto flex w-full items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#645c42] p-6 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]">
                <Button text="Explore Our Approach" size="large" mode="light" href="/approach" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

