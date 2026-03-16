'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// The two paragraphs of text, each split into display lines for animation
const TEXT_LINES = [
  "If we only remembered who we are,",
  "and why we are here, then life",
  "and everything that has happened in it,",
  "would make sense. We will no longer",
  "be lost or alone. We were, are and",
  "shall always be whole.",
  "\u00a0", // spacer line between paragraphs
  "That is the Antar Smaran Process.",
];

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
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const observerRef = useRef<Observer | null>(null);
  const lottieCompletedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const absoluteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletingRef = useRef(false);

  const [phase, setPhase] = useState<'spiral' | 'transitioning' | 'blob' | 'done'>('spiral');

  // --vh is set by page.tsx — no duplicate here

  // Fallback timers in case Lottie never fires
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fallbackDelay = isMobile ? 8000 : 10000;

    fallbackTimeoutRef.current = setTimeout(() => {
      if (!lottieCompletedRef.current) handleLottieComplete();
    }, fallbackDelay);

    absoluteTimeoutRef.current = setTimeout(() => {
      if (!isCompletingRef.current) {
        isCompletingRef.current = true;
        setPhase('done');
        onCompleteSafe();
      }
    }, 20000);

    return () => {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
      if (absoluteTimeoutRef.current) clearTimeout(absoluteTimeoutRef.current);
      if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
      if (observerRef.current) { observerRef.current.kill(); observerRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLottieComplete = useCallback(() => {
    if (lottieCompletedRef.current) return;
    lottieCompletedRef.current = true;
    if (fallbackTimeoutRef.current) { clearTimeout(fallbackTimeoutRef.current); fallbackTimeoutRef.current = null; }
    setPhase('transitioning');
  }, []);

  // Transition: spiral out → blob in → auto-animate lines
  useEffect(() => {
    if (phase !== 'transitioning') return;
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

    if (timelineRef.current) timelineRef.current.kill();

    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];

    // Start all lines invisible
    gsap.set(lines, { opacity: 0, y: 8 });

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Fade out spiral
    tl.to(spiralContainerRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' });

    // Fade in blob container
    tl.fromTo(
      blobContainerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => setPhase('blob'),
      },
      '-=0.4',
    );

    // Animate each line in, one by one, slowly and steadily
    lines.forEach((line, i) => {
      tl.to(
        line,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        // First line starts 0.3s after blob is visible; each subsequent line 0.45s apart
        `>-0.1`,
      );
      // Small extra pause after the spacer line
      if (i === 6) tl.to({}, { duration: 0.2 });
    });

    // After all lines are visible, mark as done — user must scroll to advance
    tl.call(() => {
      setPhase('done');
    });
  }, [phase]);

  // Once done, create an Observer so the user can scroll to advance
  useEffect(() => {
    if (phase !== 'done') return;
    if (typeof window === 'undefined') return;
    if (!blobContainerRef.current) return;

    const obs = Observer.create({
      target: blobContainerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onDown: () => {},
      onUp: () => {
        if (isCompletingRef.current) return;
        isCompletingRef.current = true;
        if (absoluteTimeoutRef.current) clearTimeout(absoluteTimeoutRef.current);
        onCompleteSafe();
      },
    });

    observerRef.current = obs;

    return () => {
      obs.kill();
      observerRef.current = null;
    };
  }, [phase, onCompleteSafe]);

  const showSpiral = phase === 'spiral' || phase === 'transitioning';
  const showBlob = phase === 'transitioning' || phase === 'blob' || phase === 'done';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#6a3f33]"
      style={{
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
                <p
                  className="leading-[1.55] text-[#4a3833]"
                  style={{
                    fontFamily: 'var(--font-saphira), serif',
                    fontWeight: 400,
                    fontSize: 'clamp(14px, 3.4vw, 22px)',
                  }}
                >
                  {TEXT_LINES.map((line, i) => (
                    <span
                      key={i}
                      ref={(el) => { lineRefs.current[i] = el; }}
                      style={{ display: 'block', opacity: 0 }}
                    >
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
