'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';
import Section from './Section';
import Button from './Button';

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



  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, Observer);

    const cardsSection = cardsSectionRef.current;
    if (!cardsSection) return;

    const cards = Array.from(cardsSection.querySelectorAll<HTMLElement>('.card'));
    if (cards.length < 2) return;

    const time = 0.55;
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

    // Build labels: card2, card3, ...
    for (let i = 0; i < cards.length - 1; i++) {
      tl.add(`card${i + 2}`);
      const current = cards[i];
      const next = cards[i + 1];

      // Step 1: current card scales down and fades out (stacking feel) — still single-card.
      tl.to(current, {
        scale: Math.min(0.95, 0.85 + i * 0.05),
        autoAlpha: 0,
        duration: time * 0.75,
        ease: 'power2.out',
      });

      // Step 2: next card becomes visible and slides up into place.
      tl.set(next, { zIndex: cards.length + i + 20, autoAlpha: 1 });
      tl.fromTo(
        next,
        { y: () => window.innerHeight },
        { y: 0, duration: time, ease: 'power2.out', immediateRender: false },
        '>-0.05'
      );
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
      id: 'WORK-CARDS-LOCK',
      trigger: cardsSection,
      pin: true,
      // Start when the card stack is comfortably below the fixed headers.
      start: 'top top+=340',
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
      className="relative min-h-screen w-full bg-[#f6edd0] pb-24 pt-[96px] overflow-hidden"
    >
      {/* Subtle repeating spiral background - larger and well-spaced */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0">
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute"
          style={{ width: '380px', height: 'auto', top: '5%', left: '5%', transform: 'rotate(15deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute"
          style={{ width: '360px', height: 'auto', top: '8%', right: '8%', transform: 'rotate(-60deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute"
          style={{ width: '400px', height: 'auto', bottom: '30%', left: '10%', transform: 'rotate(85deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute"
          style={{ width: '370px', height: 'auto', bottom: '25%', right: '12%', transform: 'rotate(-120deg)' }}
        />
        <img
          src="/splash_vector.svg"
          alt=""
          className="absolute"
          style={{ width: '390px', height: 'auto', bottom: '5%', left: '50%', transform: 'translate(-50%, 0) rotate(40deg)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1177px] px-8 pt-10">
        {/* GSAP card lock + stack */}
        <div ref={cardsSectionRef} className="cards-section relative w-full">
          {/* Keep width consistent with other sections (same max-w wrapper as page content). */}
          <div className="relative w-full">
            {/* Stage: cards overlap here */}
            <div className="relative h-[720px] w-full">
              {/* Card 01 */}
              <div className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[24px] bg-[#d6c68e] p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <div className="mb-10 flex justify-center">
                  <img
                    src="/we_work_together_vector_one.svg"
                    alt=""
                    className="block h-[452px] w-[431px] max-w-full object-contain"
                  />
                </div>
                <p
                  className="text-center text-[24px] leading-[normal] text-[#645c42]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  At Antar Pravaah, healing is a shared responsibility. We both do the work.
                </p>
              </div>

              {/* Cards 02-04 */}
              {workCards.map((card, index) => {
                const isLeft = card.imagePosition === 'left';
                const smallCardSrcs = ["/we_work_together_vector_two.svg", "/we_work_together_vector_three.svg", "/we_work_together_vector_four.svg"]; const imageSrc = smallCardSrcs[index] ?? smallCardSrcs[0];
                return (
                  <div
                    key={index}
                    className="card absolute left-0 right-0 top-0 mx-auto w-full rounded-[24px] bg-[#d6c68e] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  >
                    <div
                      className={`flex flex-col items-center gap-10 md:flex-row ${
                        isLeft ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      <img
                        src={imageSrc}
                        alt=""
                        className="block h-[272px] w-[258px] shrink-0 object-contain"
                      />
                      <p
                        className="flex-1 text-justify text-[24px] leading-[normal] text-[#645c42]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card (part of the stack; final card) */}
              <div className="card absolute left-0 right-0 top-0 mx-auto flex w-full items-center justify-center rounded-[24px] bg-[#645c42] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] min-h-[420px] sm:min-h-[480px]">
                <Button text="Explore Our Approach" size="large" mode="light" href="/approach" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

