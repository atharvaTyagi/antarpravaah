'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

function AnimatedText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wordEntries = text.split(' ').reduce<{ word: string; start: number }[]>((acc, word) => {
    const start = acc.length === 0 ? 0 : acc[acc.length - 1].start + acc[acc.length - 1].word.length + 1;
    acc.push({ word, start });
    return acc;
  }, []);
  return (
    <p className={className} style={style}>
      {wordEntries.map(({ word, start }, i) => (
        <span key={start} className="splash-word" style={{ opacity: 0.2 }}>
          {word}
          {i < wordEntries.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const onCompleteSafe = useMemo(
    () => (typeof onComplete === 'function' ? onComplete : () => {}),
    [onComplete],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const spiralContainerRef = useRef<HTMLDivElement>(null);
  const blobContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isCompleting = useRef(false);
  const lottieCompletedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const absoluteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [phase, setPhase] = useState<'spiral' | 'transitioning' | 'blob' | 'done'>('spiral');
  const [blobReady, setBlobReady] = useState(false);
  const wordsComplete = phase === 'done';
  const observerRef = useRef<Observer | null>(null);
  const currentWordIndexRef = useRef(0);
  const totalWordsRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollCooldown = 80;
  const wordsPerScroll = 3;

  // --vh is set by page.tsx — no duplicate here

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fallbackDelay = isMobile ? 8000 : 10000;

    fallbackTimeoutRef.current = setTimeout(() => {
      if (!lottieCompletedRef.current) {
        handleLottieComplete();
      }
    }, fallbackDelay);

    absoluteTimeoutRef.current = setTimeout(() => {
      if (!isCompleting.current) {
        isCompleting.current = true;
        setPhase('done');
        onCompleteSafe();
      }
    }, 15000);

    const mobileRevealTimeout = setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        if (blobContainerRef.current && !isCompleting.current) {
          const words = blobContainerRef.current.querySelectorAll('.splash-word');
          if (words.length > 0) {
            const firstWordOpacity = window.getComputedStyle(words[0]).opacity;
            if (parseFloat(firstWordOpacity) < 0.5) {
              gsap.to(words, {
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.out',
              });
            }
          }
        }
      }
    }, 8000);

    return () => {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      if (absoluteTimeoutRef.current) clearTimeout(absoluteTimeoutRef.current);
      clearTimeout(mobileRevealTimeout);
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollReveal = useCallback(() => {
    if (!blobContainerRef.current) return;

    const now = Date.now();
    if (now - lastScrollTimeRef.current < scrollCooldown) return;
    lastScrollTimeRef.current = now;

    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    if (words.length === 0) return;

    const currentIndex = currentWordIndexRef.current;
    const endIndex = Math.min(currentIndex + wordsPerScroll, words.length);

    for (let i = currentIndex; i < endIndex; i++) {
      gsap.to(words[i], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    currentWordIndexRef.current = endIndex;

    if (currentWordIndexRef.current >= words.length) {
      setPhase('done');
      setTimeout(() => {
        if (!isCompleting.current) {
          isCompleting.current = true;
          if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
          if (absoluteTimeoutRef.current) clearTimeout(absoluteTimeoutRef.current);
          onCompleteSafe();
        }
      }, 400);
    }
  }, [onCompleteSafe]);

  // Scoped Observer on blobContainerRef — touch-action:none is on the element
  useEffect(() => {
    if (!blobReady || wordsComplete || typeof window === 'undefined') return;
    if (!blobContainerRef.current) return;

    observerRef.current = Observer.create({
      target: blobContainerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onDown: () => {},
      onUp: () => handleScrollReveal(),
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
    };
  }, [blobReady, wordsComplete, phase, handleScrollReveal]);

  const handleLottieComplete = useCallback(() => {
    if (lottieCompletedRef.current) return;
    lottieCompletedRef.current = true;

    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    setPhase('transitioning');
  }, []);

  // Transition: spiral out, blob in
  useEffect(() => {
    if (phase !== 'transitioning') return;
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(spiralContainerRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
    });

    tl.fromTo(
      blobContainerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          setPhase('blob');

          if (blobContainerRef.current) {
            const words = blobContainerRef.current.querySelectorAll('.splash-word');
            totalWordsRef.current = words.length;
            currentWordIndexRef.current = 0;

            if (words.length > 0) {
              setBlobReady(true);
            } else {
              if (!isCompleting.current) {
                isCompleting.current = true;
                onCompleteSafe();
              }
            }
          }
        },
      },
      '-=0.4',
    );
  }, [phase, onCompleteSafe]);

  // Ensure all words visible when done
  useEffect(() => {
    if (phase !== 'done') return;
    if (!blobContainerRef.current) return;

    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    words.forEach((word) => {
      (word as HTMLElement).style.opacity = '1';
    });
  }, [phase]);

  const showSpiral = phase === 'spiral' || phase === 'transitioning';
  const showBlob = phase === 'transitioning' || phase === 'blob' || phase === 'done';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#6a3f33]"
      style={{
        /* WebKit needs the splash container on its own GPU layer so the
           Lottie canvas and blob SVG actually get composited and painted.
           overflow:hidden is avoided because WebKit ignores it under
           will-change:transform ancestors; -webkit-mask-image forces a
           compositing mask that Safari respects in all stacking contexts. */
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        maskImage: 'radial-gradient(white, black)',
        transform: 'translateZ(0)',
      }}
    >
      {showSpiral && (
        <div
          ref={spiralContainerRef}
          data-testid="spiral-container"
          className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
          style={{ opacity: phase === 'spiral' ? 1 : undefined }}
        >
          <div
            className="block w-full h-full max-w-[min(90vw,90vh)] max-h-[min(90vw,90vh)]"
            style={{ transform: 'translateZ(0)' }}
          >
            <DotLottieReact
              src="/spiral_animation.lottie"
              loop={false}
              autoplay
              useFrameInterpolation={false}
              style={{ width: '100%', height: '100%' }}
              renderConfig={{ freezeOnOffscreen: false }}
              dotLottieRefCallback={(dotLottie: DotLottie) => {
                if (!dotLottie) return;
                dotLottie.addEventListener('complete', handleLottieComplete);
                dotLottie.addEventListener('load', () => {
                  if (fallbackTimeoutRef.current) {
                    clearTimeout(fallbackTimeoutRef.current);
                    fallbackTimeoutRef.current = setTimeout(() => {
                      if (!lottieCompletedRef.current) handleLottieComplete();
                    }, 15000);
                  }
                });
              }}
            />
          </div>
        </div>
      )}

      {showBlob && (
        <div
          ref={blobContainerRef}
          data-testid="blob-container"
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: phase === 'transitioning' ? 0 : 1,
            touchAction: 'none',
            transform: 'translateZ(0)',
          }}
        >
          <div className="relative w-[680px] aspect-square max-w-none sm:w-[clamp(360px,min(95vw,75dvh),760px)] sm:aspect-auto sm:h-[clamp(360px,min(95vw,75dvh),760px)]">
            <div className="w-full h-full relative">
              <Image
                src="/splash_blob.svg"
                alt=""
                fill
                sizes="(max-width: 640px) 680px, 760px"
                className="object-contain"
                aria-hidden={true}
                priority
              />
              <div
                className="absolute top-1/2 left-1/2 text-center z-10"
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  maxHeight: '85%',
                  padding: 'clamp(28px, 10%, 72px)',
                  overflow: 'hidden',
                }}
              >
                <AnimatedText
                  text="If we only remembered who we are, and why we are here, then life and everything that has happened in it, would make sense. We will no longer be lost or alone. We were, are and shall always be whole."
                  className="leading-[1.3] text-[#4a3833] mb-3"
                  style={{
                    fontFamily: 'var(--font-saphira), serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 3.8vw, 24px)',
                    marginBottom: 'clamp(8px, 2vw, 16px)',
                  }}
                />
                <AnimatedText
                  text="That is the Antar Smaran Process."
                  className="leading-[1.3] text-[#4a3833]"
                  style={{
                    fontFamily: 'var(--font-saphira), serif',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 3.8vw, 24px)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
