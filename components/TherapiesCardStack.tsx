'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';

export interface TherapiesStackCard {
  key: string;
  render: React.ReactNode;
}

interface TherapiesCardStackProps {
  cards: TherapiesStackCard[];
  /** Section title shown above the cards */
  title?: string;
}

export default function TherapiesCardStack({ cards, title }: TherapiesCardStackProps) {
  const cardsSectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState(800);

  // Calculate stage height based on tallest card
  useEffect(() => {
    if (!stageRef.current) return;
    const cardElements = stageRef.current.querySelectorAll<HTMLElement>('.therapy-card');
    let maxHeight = 800;
    cardElements.forEach((card) => {
      const height = card.offsetHeight;
      if (height > maxHeight) maxHeight = height;
    });
    setStageHeight(maxHeight);
  }, [cards]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, Observer);

    const cardsSection = cardsSectionRef.current;
    if (!cardsSection) return;

    const cardElements = Array.from(cardsSection.querySelectorAll<HTMLElement>('.therapy-card'));
    if (cardElements.length < 2) return;

    const time = 0.45; // Snappier animation timing for cohesive feel
    let animating = false;

    // Single-card focus layout: only one card is visible at a time.
    gsap.set(cardElements, {
      autoAlpha: 0,
      y: 0,
      scale: 1,
      transformOrigin: 'center top',
      zIndex: 1,
    });
    gsap.set(cardElements[0], { autoAlpha: 1, zIndex: cardElements.length + 10 });

    const tl = gsap.timeline({ paused: true });

    // Get text elements for each card to animate them separately
    const getCardTextElements = (card: HTMLElement) => {
      return {
        title: card.querySelector('h3'),
        subtitle: card.querySelector('p[class*="uppercase"]'),
        content: card.querySelectorAll('.flex-col > div, .flex-col > p:not([class*="uppercase"])'),
        icon: card.querySelector('img'),
        button: card.querySelector('button, a'),
      };
    };

    // Set initial state for first card's text elements
    const firstCardText = getCardTextElements(cardElements[0]);
    gsap.set([firstCardText.title, firstCardText.subtitle, firstCardText.icon], { autoAlpha: 1 });
    gsap.set(firstCardText.content, { autoAlpha: 1 });
    gsap.set(firstCardText.button, { autoAlpha: 1 });

    // Build labels: card2, card3, ...
    for (let i = 0; i < cardElements.length - 1; i++) {
      tl.add(`card${i + 2}`);
      const current = cardElements[i];
      const next = cardElements[i + 1];
      const currentText = getCardTextElements(current);
      const nextText = getCardTextElements(next);

      // All text fades out together with slight stagger for organic feel
      tl.to([currentText.title, currentText.subtitle, currentText.icon, currentText.button], {
        autoAlpha: 0,
        y: -8,
        duration: time * 0.5,
        ease: 'power2.inOut',
      });
      tl.to(currentText.content, {
        autoAlpha: 0,
        y: -8,
        duration: time * 0.45,
        stagger: 0.015,
        ease: 'power2.inOut',
      }, '<0.02');

      // Card container fades out while text is fading
      tl.to(current, {
        scale: 0.98,
        autoAlpha: 0,
        duration: time * 0.5,
        ease: 'power2.inOut',
      }, '<0.1');

      // Next card setup and slide in - starts before current fully fades
      tl.set(next, { zIndex: cardElements.length + i + 20, autoAlpha: 1 }, '<0.2');
      tl.set([nextText.title, nextText.subtitle, nextText.icon], { autoAlpha: 0, y: 12 }, '<');
      tl.set(nextText.content, { autoAlpha: 0, y: 15 }, '<');
      tl.set(nextText.button, { autoAlpha: 0, y: 10 }, '<');

      tl.fromTo(
        next,
        { y: () => window.innerHeight * 0.3 },
        { y: 0, duration: time * 0.55, ease: 'power2.out', immediateRender: false },
        '<'
      );

      // Text fades in as card settles - all together for cohesion
      tl.to([nextText.icon, nextText.title], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.5,
        ease: 'power2.out',
      }, '<0.1');
      tl.to([nextText.subtitle], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.45,
        ease: 'power2.out',
      }, '<0.03');
      tl.to(nextText.content, {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.45,
        stagger: 0.02,
        ease: 'power2.out',
      }, '<0.03');
      tl.to([nextText.button], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.4,
        ease: 'power2.out',
      }, '<0.05');
    }
    tl.add(`card${cardElements.length + 1}`);

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
        // Pause Lenis while we take over scroll.
        (window as unknown as { __lenis?: { stop?: () => void } }).__lenis?.stop?.();

        // Freeze native scroll position (fixes momentum scrolling)
        const savedScroll = self.scrollY();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (self as any)._restoreScroll = () => self.scrollY(savedScroll);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.addEventListener('scroll', (self as any)._restoreScroll, { passive: false });
      },
      onDisable(self) {
        // Resume Lenis when done.
        (window as unknown as { __lenis?: { start?: () => void } }).__lenis?.start?.();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.removeEventListener('scroll', (self as any)._restoreScroll);
      },
    });

    cardsObserver.disable();

    const st = ScrollTrigger.create({
      id: 'THERAPIES-CARDS-LOCK',
      trigger: cardsSection,
      pin: true,
      // Start when the card stack is comfortably below the fixed headers.
      start: 'top top+=200',
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
  }, [cards]);

  return (
    <div ref={cardsSectionRef} className="cards-section relative w-full">
      {/* Section Title */}
      {title && (
        <div className="mb-10 text-center">
          <h2
            className="text-[48px] leading-normal text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Keep width consistent with other sections */}
      <div className="relative w-full">
        {/* Stage: cards overlap here */}
        <div ref={stageRef} className="relative w-full" style={{ height: `${stageHeight}px` }}>
          {cards.map((card) => (
            <div
              key={card.key}
              className="therapy-card absolute left-0 right-0 top-0 mx-auto w-full"
            >
              {card.render}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
