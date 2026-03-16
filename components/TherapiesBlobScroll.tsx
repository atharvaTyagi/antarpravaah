'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from '@/components/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

const therapiesButtonColors = {
  fg: '#645c42',
  fgHover: '#d6c68e',
  bgHover: '#645c42',
};

// All text as individual lines for animation — order matches the original content
const TEXT_LINES = [
  { text: 'Come and find me....', type: 'opening' },
  { text: 'Find me when you have lost track of your path,', type: 'line' },
  { text: 'When you have forgotten what you like and dislike,', type: 'line' },
  { text: 'When you are bored of always seeking people to fill the emptiness you feel within,', type: 'line' },
  { text: 'When your body hurts and you can\'t take it no more,', type: 'line' },
  { text: 'When you feel purposeless and joyless,', type: 'line' },
  { text: 'When this life seems alien,', type: 'line' },
  { text: 'When dealing with others drains your energy,', type: 'line' },
  { text: 'When you cannot see the light in others and only the dark in yourself,', type: 'line' },
  { text: 'Find me when no answer is good enough,', type: 'line' },
  { text: 'When you have been to enough people seeking to get clarity about your life,', type: 'line' },
  { text: 'Find me when you are ready to find yourself.', type: 'closing' },
];

interface TherapiesBlobScrollProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
  onCtaClick?: () => void;
  onAnimationComplete?: () => void;
  onScrollLockChange?: (locked: boolean) => void;
}

export default function TherapiesBlobScroll({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
  onCtaClick,
  onAnimationComplete,
  onScrollLockChange,
}: TherapiesBlobScrollProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const blobContainerRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const observerRef = useRef<Observer | null>(null);
  const hasCompletedOnceRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const scrollCooldown = 400;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  const getLines = () => lineRefs.current.filter(Boolean) as HTMLSpanElement[];

  const showAllInstant = () => {
    gsap.set(getLines(), { opacity: 1, y: 0 });
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1 });
  };

  const hideAllInstant = () => {
    gsap.set(getLines(), { opacity: 0, y: 8 });
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0 });
  };

  const killTimeline = () => {
    if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
  };

  const killObserver = () => {
    if (observerRef.current) { observerRef.current.kill(); observerRef.current = null; }
  };

  // Create the scroll-navigation Observer (used after animation completes)
  const createNavigationObserver = () => {
    killObserver();
    observerRef.current = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onDown: () => {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < scrollCooldown) return;
        lastScrollTimeRef.current = now;
        onEdgeReached?.('start');
      },
      onUp: () => {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < scrollCooldown) return;
        lastScrollTimeRef.current = now;
        onEdgeReached?.('end');
      },
    });
  };

  // -------------------------------------------------------------------------
  // Auto-animate lines, then show CTA and hand off to scroll
  // -------------------------------------------------------------------------

  const runAnimation = () => {
    killTimeline();
    killObserver();

    const lines = getLines();
    gsap.set(lines, { opacity: 0, y: 8 });
    if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0 });

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Animate each line in steadily, one by one
    lines.forEach((line) => {
      tl.to(line, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '>-0.05');
    });

    // Fade in CTA after last line
    if (ctaRef.current) {
      tl.to(ctaRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '+=0.2');
    }

    tl.call(() => {
      hasCompletedOnceRef.current = true;
      onAnimationComplete?.();
      onScrollLockChange?.(false);
      lastScrollTimeRef.current = Date.now();
      createNavigationObserver();
    });
  };

  // -------------------------------------------------------------------------
  // isActive: start animation or restore completed state
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isClient) return;

    if (isActive) {
      const startDelay = setTimeout(() => {
        if (hasCompletedOnceRef.current) {
          // Already animated before — show final state, enable navigation
          showAllInstant();
          onScrollLockChange?.(false);
          createNavigationObserver();
          lastScrollTimeRef.current = Date.now();
        } else {
          onScrollLockChange?.(true);
          runAnimation();
        }
      }, 350);
      return () => clearTimeout(startDelay);
    } else {
      killTimeline();
      killObserver();
      onScrollLockChange?.(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isClient]);

  // -------------------------------------------------------------------------
  // Reset handlers
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!resetToStart || !isClient) return;
    killTimeline();
    killObserver();
    if (hasCompletedOnceRef.current) {
      showAllInstant();
    } else {
      hideAllInstant();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToStart, isClient]);

  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    killTimeline();
    killObserver();
    hasCompletedOnceRef.current = true;
    showAllInstant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToEnd, isClient]);

  // -------------------------------------------------------------------------
  // Initial DOM state on mount
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isClient) return;
    hideAllInstant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  return (
    <div
      ref={sectionRef}
      className="therapies-blob-scroll relative w-full h-full flex items-center justify-center overflow-visible py-4 sm:py-6 lg:py-8"
    >
      <div ref={blobContainerRef} className="relative flex items-center justify-center w-full h-full max-h-full">
        <div className="relative flex items-center justify-center max-h-full w-full">
          {/* Blob background */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[680px] sm:w-[min(90vw,85vh)] lg:w-[min(85vw,80vh)] h-auto max-w-none"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)',
            }}
          />

          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-[12%] sm:px-[14%] lg:px-[15%] py-[8%] sm:py-[9%] lg:py-[10%]">
            <div className="flex flex-col items-center justify-center text-center max-w-[95%] sm:max-w-[92%] lg:max-w-[90%] gap-[clamp(4px,0.8vh,12px)]">

              {TEXT_LINES.map((line, i) => (
                <span
                  key={i}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  className={[
                    'block leading-[1.35] text-[#645c42]',
                    line.type === 'opening'
                      ? 'text-[clamp(16px,3.8vw,24px)] sm:text-[clamp(24px,4vmin,42px)]'
                      : line.type === 'closing'
                      ? 'text-[clamp(16px,3.8vw,24px)] sm:text-[clamp(20px,3.5vmin,36px)] mt-[clamp(4px,1vh,12px)]'
                      : 'text-[clamp(16px,3.8vw,24px)] sm:text-[clamp(12px,1.8vmin,18px)]',
                  ].join(' ')}
                  style={{
                    fontFamily: 'var(--font-saphira), serif',
                    fontWeight: 400,
                    opacity: 0,
                  }}
                >
                  {line.text}
                </span>
              ))}

              {/* CTA Button */}
              <div
                ref={ctaRef}
                className="mt-[clamp(12px,2vh,24px)]"
                style={{ opacity: 0 }}
              >
                <Button
                  text="Book Your First Session"
                  onClick={onCtaClick}
                  size="large"
                  colors={therapiesButtonColors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
