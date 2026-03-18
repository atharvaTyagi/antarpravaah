'use client';

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import { MobileModalityData } from './MobileModalityCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z" fill="currentColor"/>
      <path d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z" fill="currentColor"/>
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M2.69019 9.10567C2.68288 9.10558 2.67611 9.10574 2.66866 9.10526C2.64795 9.10457 2.62575 9.10222 2.60966 9.0899C2.57463 9.06362 2.58486 9.01034 2.59955 8.96862C2.75564 8.52544 3.05753 8.18017 3.3305 7.79866C3.60348 7.41714 3.86931 7.01367 4.0848 6.59226C4.4115 5.95438 4.76304 5.00818 4.683 4.30464C4.58386 3.42752 4.04831 2.58576 3.52743 1.89555C3.39042 1.71389 2.52974 0.922658 2.56292 0.73448C2.61044 0.464118 3.46981 1.05424 3.60385 1.13789C5.1795 2.11502 6.35612 3.57618 5.84566 5.50449C5.82333 5.58856 5.79992 5.67214 5.77461 5.7555C5.63391 6.22345 5.45951 6.69259 5.13169 7.07999C4.84308 7.42154 4.53417 7.74786 4.20756 8.05588C3.9726 8.27765 3.72818 8.49047 3.47551 8.69263C3.24182 8.87993 3.01363 9.10285 2.68978 9.1045L2.69019 9.10567Z" fill="currentColor"/>
      <path d="M7.87036 9.10567C7.86305 9.10558 7.85628 9.10574 7.84884 9.10526C7.82812 9.10457 7.80592 9.10222 7.78983 9.0899C7.75481 9.06362 7.76504 9.01034 7.77972 8.96862C7.93582 8.52544 8.23771 8.18017 8.51068 7.79866C8.78365 7.41714 9.04948 7.01367 9.26498 6.59226C9.59168 5.95438 9.94321 5.00818 9.86317 4.30464C9.76403 3.42752 9.22849 2.58576 8.70761 1.89555C8.5706 1.71389 7.70991 0.922658 7.7431 0.73448C7.79062 0.464118 8.64998 1.05424 8.78402 1.13789C10.3597 2.11502 11.5363 3.57618 11.0258 5.50449C11.0035 5.58856 10.9801 5.67214 10.9548 5.7555C10.8141 6.22345 10.6397 6.69259 10.3119 7.07999C10.0233 7.42154 9.71435 7.74786 9.38774 8.05588C9.15278 8.27765 8.90835 8.49047 8.65569 8.69263C8.422 8.87993 8.19381 9.10285 7.86996 9.1045L7.87036 9.10567Z" fill="currentColor"/>
    </svg>
  );
}

interface ModalitiesCardStackProps {
  modalities: MobileModalityData[];
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onCtaClick?: () => void;
}

export default function ModalitiesCardStack({
  modalities,
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
  onExpandedChange,
  onCtaClick,
}: ModalitiesCardStackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  // One card per modality — track which is active
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Per-card expanded state — tracked in a ref array for GSAP access + state for re-render
  const expandedRef = useRef<boolean[]>([]);
  const [expandedState, setExpandedState] = useState<boolean[]>([]);
  // Refs to each card's collapsed/expanded content layers
  const collapsedLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandedLayerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const TOTAL = modalities.length;
  const scrollCooldown = 400;

  useEffect(() => {
    expandedRef.current = modalities.map(() => false);
    setExpandedState(modalities.map(() => false));
    setIsClient(true);
  }, [modalities]);

  const getAllCards = useCallback(() => {
    if (!cardsContainerRef.current) return [];
    return Array.from(cardsContainerRef.current.querySelectorAll<HTMLElement>('.modality-card'));
  }, []);

  const setInitialState = useCallback((focusIndex: number, direction: 'start' | 'end' = 'start') => {
    const cards = getAllCards();
    cards.forEach((card, i) => {
      gsap.set(card, {
        autoAlpha: i === focusIndex ? 1 : 0,
        scale: i === focusIndex ? 1 : 0.95,
        y: i === focusIndex ? 0 : (direction === 'start' ? 30 : -20),
        pointerEvents: i === focusIndex ? 'auto' : 'none',
      });
    });
    // Reset all cards to collapsed state
    expandedRef.current = modalities.map(() => false);
    setExpandedState(modalities.map(() => false));
    collapsedLayerRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 1 }));
    expandedLayerRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));
  }, [getAllCards, modalities]);

  // Reset to start
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    activeIndexRef.current = 0;
    lastScrollTimeRef.current = Date.now();
    setInitialState(0, 'start');
    onExpandedChange?.(false);
  }, [resetToStart, isClient, setInitialState, onExpandedChange]);

  // Reset to end
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    activeIndexRef.current = TOTAL - 1;
    lastScrollTimeRef.current = Date.now();
    setInitialState(TOTAL - 1, 'end');
    onExpandedChange?.(false);
  }, [resetToEnd, isClient, TOTAL, setInitialState, onExpandedChange]);

  // Enable/disable observer based on isActive AND whether any card is expanded
  const syncObserver = useCallback((active: boolean, anyExpanded: boolean) => {
    if (!observerRef.current) return;
    if (active && !anyExpanded) {
      observerRef.current.enable();
    } else {
      observerRef.current.disable();
    }
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;
    const anyExpanded = expandedRef.current.some(Boolean);
    if (isActive) {
      const t = setTimeout(() => {
        syncObserver(true, anyExpanded);
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(t);
    } else {
      syncObserver(false, anyExpanded);
    }
  }, [isActive, syncObserver]);

  // Expand a card in-place: fade out collapsed layer, fade in expanded layer
  const expandCard = useCallback((index: number) => {
    const collapsed = collapsedLayerRefs.current[index];
    const expanded = expandedLayerRefs.current[index];
    if (!collapsed || !expanded) return;

    expandedRef.current[index] = true;
    setExpandedState((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    onExpandedChange?.(true);
    // Disable observer so scroll inside the card works natively
    observerRef.current?.disable();

    gsap.to(collapsed, { autoAlpha: 0, duration: 0.25, ease: 'power2.inOut' });
    gsap.fromTo(
      expanded,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.15 },
    );
  }, [onExpandedChange]);

  // Collapse a card in-place: fade out expanded layer, fade in collapsed layer
  const collapseCard = useCallback((index: number) => {
    const collapsed = collapsedLayerRefs.current[index];
    const expanded = expandedLayerRefs.current[index];
    if (!collapsed || !expanded) return;

    expandedRef.current[index] = false;
    setExpandedState((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    onExpandedChange?.(false);

    gsap.to(expanded, { autoAlpha: 0, y: 12, duration: 0.25, ease: 'power2.inOut' });
    gsap.fromTo(
      collapsed,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.3,
        ease: 'power2.out',
        delay: 0.1,
        onComplete: () => {
          // Re-enable observer after animation so scroll immediately works
          observerRef.current?.enable();
          lastScrollTimeRef.current = Date.now();
        },
      },
    );
  }, [onExpandedChange]);

  // Animate between cards (only when all cards are collapsed)
  const animateToIndex = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= TOTAL) return;
    if (isAnimatingRef.current) return;

    const currentIndex = activeIndexRef.current;
    if (newIndex === currentIndex) return;

    const cards = getAllCards();
    if (cards.length === 0) return;

    isAnimatingRef.current = true;
    activeIndexRef.current = newIndex;

    const isScrollingDown = newIndex > currentIndex;
    const yStart = isScrollingDown ? 30 : -30;
    const yEnd = isScrollingDown ? -20 : 20;

    const currentCard = cards[currentIndex];
    if (currentCard) {
      gsap.to(currentCard, {
        autoAlpha: 0,
        scale: 0.95,
        y: yEnd,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => { gsap.set(currentCard, { pointerEvents: 'none' }); },
      });
    }

    const newCard = cards[newIndex];
    if (newCard) {
      gsap.fromTo(
        newCard,
        { autoAlpha: 0, scale: 0.95, y: yStart, pointerEvents: 'none' },
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
          },
        },
      );
    } else {
      isAnimatingRef.current = false;
      lastScrollTimeRef.current = Date.now();
    }
  }, [TOTAL, getAllCards]);

  const handleScroll = useCallback((direction: 'up' | 'down') => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < scrollCooldown) return;
    if (isAnimatingRef.current) return;
    // Never scroll between cards while any card is expanded
    if (expandedRef.current.some(Boolean)) return;

    const current = activeIndexRef.current;

    if (direction === 'down') {
      if (current < TOTAL - 1) {
        animateToIndex(current + 1);
      } else {
        lastScrollTimeRef.current = now;
        onEdgeReached?.('end');
      }
    } else {
      if (current > 0) {
        animateToIndex(current - 1);
      } else {
        lastScrollTimeRef.current = now;
        onEdgeReached?.('start');
      }
    }
  }, [TOTAL, animateToIndex, onEdgeReached]);

  // Keep a stable ref to handleScroll so the Observer never needs to be recreated
  const handleScrollRef = useRef(handleScroll);
  useEffect(() => { handleScrollRef.current = handleScroll; }, [handleScroll]);

  // One-time setup: create Observer + set initial card state
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!containerRef.current || !cardsContainerRef.current) return;

    setInitialState(0, 'start');

    const obs = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScrollRef.current('up'),
      onUp: () => handleScrollRef.current('down'),
    });

    obs.disable();
    observerRef.current = obs;

    return () => {
      obs.kill();
      observerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#f6edd0]"
      style={{ clipPath: 'inset(0)', touchAction: 'none' }}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Title */}
        <div className="relative z-10 w-full text-center pt-4 pb-3 flex-shrink-0">
          <h2
            className="text-[28px] leading-[1.1] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Our Modalities
          </h2>
        </div>

        {/* Cards container */}
        <div
          ref={cardsContainerRef}
          className="relative z-10 flex-1 flex items-center justify-center p-4 pb-6"
        >
          <div className="relative w-full h-full">
            {modalities.map((modality, i) => (
              <div
                key={modality.id}
                className="modality-card absolute inset-0 rounded-[24px] bg-[#d6c68e] shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden"
                style={{ isolation: 'isolate', clipPath: 'inset(0 round 24px)', transform: 'translateZ(0)' }}
              >
                {/* ── Collapsed layer ── */}
                <div
                  ref={(el) => { collapsedLayerRefs.current[i] = el; }}
                  className="absolute inset-0 px-10 py-7 flex flex-col gap-4 items-start justify-end"
                >
                  <div className="flex-1 flex items-center justify-center min-h-0 w-full rounded-[24px] p-4">
                    <img
                      src={modality.iconSrc}
                      alt={modality.title}
                      className="w-[70%] h-auto max-h-[260px] object-contain"
                    />
                  </div>

                  <h3
                    className="text-[36px] leading-normal text-[#635d45] w-full shrink-0"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    {modality.title}
                  </h3>

                  <p
                    className="text-[16px] leading-[24px] text-[#635d45] w-full shrink-0"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    {modality.subtitle}
                  </p>

                  <div className="w-full shrink-0">
                    <button
                      onClick={() => expandCard(i)}
                      className="w-full inline-flex items-center justify-center gap-2 p-3 text-[#635d45] hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                    >
                      <ArrowLeft className="w-5 h-4 shrink-0" />
                      <span className="text-center text-[16px] tracking-[2px] uppercase leading-tight">
                        Read More
                      </span>
                      <ArrowRight className="w-5 h-4 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* ── Expanded layer ── */}
                <div
                  ref={(el) => { expandedLayerRefs.current[i] = el; }}
                  className="absolute inset-0 p-6 flex flex-col"
                  style={{ opacity: 0, visibility: 'hidden' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 shrink-0">
                    <h3
                      className="text-[28px] leading-[1.0] text-[#645c42] flex-1"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      {modality.title}
                    </h3>
                    <button
                      onClick={() => collapseCard(i)}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#645c42] hover:opacity-70 transition-opacity ml-4 mt-1"
                      aria-label="Close details"
                    >
                      <img
                        src="/Icon - Close.svg"
                        alt="Close"
                        className="h-6 w-6"
                        style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(8%) saturate(1467%) hue-rotate(12deg) brightness(95%) contrast(87%)' }}
                      />
                    </button>
                  </div>

                  {/* Scrollable content — native scroll, no preventDefault */}
                  <div
                    className="flex-1 overflow-y-auto min-h-0 overscroll-contain no-scrollbar"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <p
                      className="text-[14px] leading-[22px] text-[#645c42] mb-3"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                    >
                      {modality.subtitle}
                    </p>

                    <div
                      className="text-[14px] leading-[22px] text-[#645c42] text-justify mb-3"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                    >
                      {modality.description.map((para, idx) => (
                        <p key={idx} className={idx < modality.description.length - 1 ? 'mb-3' : ''}>
                          {para}
                        </p>
                      ))}
                    </div>

                    {(modality.bestFor.column1.length > 0 || modality.bestFor.column2.length > 0) && (
                      <div className="mb-3">
                        <p
                          className="text-[14px] leading-[22px] text-[#645c42] mb-1"
                          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                        >
                          Best For
                        </p>
                        <ul
                          className="list-disc list-inside text-[13px] leading-[20px] text-[#645c42]"
                          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                        >
                          {[...modality.bestFor.column1, ...modality.bestFor.column2].map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mb-3">
                      <p
                        className="text-[14px] leading-[22px] text-[#645c42]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                      >
                        Session Duration
                      </p>
                      <p
                        className="text-[13px] leading-[20px] text-[#645c42]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        {modality.sessionDuration}
                      </p>
                    </div>

                    <div className="pt-1 pb-2">
                      <button
                        onClick={onCtaClick}
                        className="inline-flex items-center justify-center gap-2 p-3 text-[#645c42] hover:opacity-80 transition-opacity w-full"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        <ArrowLeft className="w-5 h-4 shrink-0" />
                        <span className="text-center text-[16px] tracking-[2px] uppercase leading-tight">
                          {modality.ctaText}
                        </span>
                        <ArrowRight className="w-5 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
