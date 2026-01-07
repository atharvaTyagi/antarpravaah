'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';

export interface PathwaysStackCard {
  key: string;
  render: React.ReactNode;
}

interface PathwaysCardStackProps {
  cards: PathwaysStackCard[];
  /** Section title shown above the cards */
  title?: string;
}

export default function PathwaysCardStack({ cards, title }: PathwaysCardStackProps) {
  const cardsSectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState(680);

  // Calculate stage height based on tallest card
  useEffect(() => {
    if (!stageRef.current) return;
    const cardElements = stageRef.current.querySelectorAll<HTMLElement>('.pathway-card');
    let maxHeight = 680;
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

    const cardElements = Array.from(cardsSection.querySelectorAll<HTMLElement>('.pathway-card'));
    if (cardElements.length < 2) return;

    const time = 0.95; // Slower animation timing for smoother feel
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
        content: card.querySelectorAll('.text-justify, .list-disc'),
        image: card.querySelector('img'),
        button: card.querySelector('button, a'),
        contentCard: card.querySelector('.rounded-\\[24px\\]'),
      };
    };

    // Set initial state for first card's text elements
    const firstCardText = getCardTextElements(cardElements[0]);
    gsap.set([firstCardText.title, firstCardText.subtitle, firstCardText.image], { autoAlpha: 1 });
    gsap.set(firstCardText.content, { autoAlpha: 1 });
    gsap.set(firstCardText.button, { autoAlpha: 1 });
    gsap.set(firstCardText.contentCard, { autoAlpha: 1 });

    // Build labels: card2, card3, ...
    for (let i = 0; i < cardElements.length - 1; i++) {
      tl.add(`card${i + 2}`);
      const current = cardElements[i];
      const next = cardElements[i + 1];
      const currentText = getCardTextElements(current);
      const nextText = getCardTextElements(next);

      // All text fades out together with slight stagger for organic feel
      tl.to([currentText.title, currentText.subtitle, currentText.image, currentText.button], {
        autoAlpha: 0,
        y: -8,
        duration: time * 0.5,
        ease: 'power2.inOut',
      });
      tl.to(currentText.content, {
        autoAlpha: 0,
        y: -8,
        duration: time * 0.5,
        stagger: 0.015,
        ease: 'power2.inOut',
      }, '<0.02');

      // Card container fades out while text is fading
      tl.to(current, {
        scale: 0.96,
        autoAlpha: 0,
        duration: time * 0.5,
        ease: 'power2.inOut',
      }, '<0.1');

      // Next card setup and slide in - starts before current fully fades
      tl.set(next, { zIndex: cardElements.length + i + 20, autoAlpha: 1 }, '<0.2');
      tl.set([nextText.title, nextText.subtitle, nextText.image], { autoAlpha: 0, y: 12 }, '<');
      tl.set(nextText.content, { autoAlpha: 0, y: 15 }, '<');
      tl.set(nextText.button, { autoAlpha: 0, y: 10 }, '<');

      tl.fromTo(
        next,
        { y: () => window.innerHeight * 0.15 },
        { y: 0, duration: time * 0.55, ease: 'power2.out', immediateRender: false },
        '<'
      );

      // Text fades in as card settles - all together for cohesion
      tl.to([nextText.image, nextText.title], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.5,
        ease: 'power2.out',
      }, '<0.1');
      tl.to([nextText.subtitle], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.5,
        ease: 'power2.out',
      }, '<0.03');
      tl.to(nextText.content, {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.5,
        stagger: 0.02,
        ease: 'power2.out',
      }, '<0.03');
      tl.to([nextText.button], {
        autoAlpha: 1,
        y: 0,
        duration: time * 0.5,
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
      id: 'PATHWAYS-CARDS-LOCK',
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
    <div ref={cardsSectionRef} className="cards-section relative w-full flex flex-col items-center">
      {/* Section Title */}
      {title && (
        <div className="mb-8 text-center">
          <h2
            className="text-[40px] leading-normal text-[#9ac1bf]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Keep width consistent with other sections - aspect ratio 1347:763 from Figma */}
      <div className="relative w-full max-w-[1200px] mx-auto">
        {/* Stage: cards overlap here */}
        <div ref={stageRef} className="relative w-full" style={{ height: `${stageHeight}px` }}>
          {cards.map((card) => (
            <div
              key={card.key}
              className="pathway-card absolute left-0 right-0 top-0 w-full"
            >
              {card.render}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
