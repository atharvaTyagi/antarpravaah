'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// Helper component to render text with word-by-word spans
function AnimatedText({ 
  text, 
  className, 
  style 
}: { 
  text: string; 
  className?: string; 
  style?: React.CSSProperties;
}) {
  let pos = 0;
  const wordEntries = text.split(' ').map((word) => {
    const start = pos;
    pos += word.length + 1;
    return { word, start };
  });
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
  const onCompleteSafe = typeof onComplete === 'function' ? onComplete : () => {};
  const containerRef = useRef<HTMLDivElement>(null);
  const spiralContainerRef = useRef<HTMLDivElement>(null);
  const blobContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isCompleting = useRef(false);
  const lottieCompletedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const absoluteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React state for phase tracking — controls visibility via inline styles
  const [phase, setPhase] = useState<'spiral' | 'transitioning' | 'blob' | 'done'>('spiral');
  const [blobReady, setBlobReady] = useState(false);
  const wordsComplete = phase === 'done';
  const observerRef = useRef<Observer | null>(null);
  const currentWordIndexRef = useRef(0);
  const totalWordsRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollCooldown = 80;
  const wordsPerScroll = 3;

  // Set --vh CSS variable for mobile viewport height
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    syncVh();
    const timeoutId = setTimeout(syncVh, 100);
    window.addEventListener('resize', syncVh);
    window.addEventListener('orientationchange', syncVh);

    return () => {
      window.removeEventListener('resize', syncVh);
      window.removeEventListener('orientationchange', syncVh);
      clearTimeout(timeoutId);
    };
  }, []);

  // Main initialization effect - timeouts and fallbacks
  useEffect(() => {
    // Lottie fallback: skip to blob if WASM/animation hasn't started within the window.
    // 8 s on mobile (slow connections + WASM cold-start), 10 s on desktop.
    // If the dotlottie 'load' event fires before this, the timer is reset to a longer
    // value so a confirmed-playing animation is never cut short.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fallbackDelay = isMobile ? 8000 : 10000;

    fallbackTimeoutRef.current = setTimeout(() => {
      if (!lottieCompletedRef.current) {
        handleLottieComplete();
      }
    }, fallbackDelay);

    // Absolute safety timeout: force splash completion after 15 seconds
    absoluteTimeoutRef.current = setTimeout(() => {
      if (!isCompleting.current) {
        isCompleting.current = true;
        setPhase('done');
        onCompleteSafe();
      }
    }, 15000);
    
    // Mobile safety: auto-reveal words after 8 seconds if stuck in blob phase
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

  // Handle scroll to reveal words
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

  // Setup GSAP Observer when blob is ready
  useEffect(() => {
    if (!blobReady || wordsComplete || typeof window === 'undefined') return;
    if (!blobContainerRef.current) return;

    // Scope to blobContainerRef (absolute inset-0, covers full viewport).
    // On iOS, non-passive touch listeners only work when the target element has
    // touch-action:none — scoping to the container rather than window ensures
    // iOS honours preventDefault and the scroll-reveal captures all touch input.
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
  }, [blobReady, phase, handleScrollReveal]);

  // Handle Lottie animation complete
  const handleLottieComplete = useCallback(() => {
    if (lottieCompletedRef.current) return;
    lottieCompletedRef.current = true;

    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    // Start transition: set phase to 'transitioning' so both are rendered,
    // then animate with GSAP
    setPhase('transitioning');
  }, []);

  // When phase changes to 'transitioning', animate spiral out and blob in
  useEffect(() => {
    if (phase !== 'transitioning') return;
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Fade out spiral, fade in blob
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
          // Transition done — switch to blob phase
          setPhase('blob');

          // Setup scroll-based word reveal
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
      '-=0.4'
    );
  }, [phase, onCompleteSafe]);

  // When phase changes to 'done', ensure final state
  useEffect(() => {
    if (phase !== 'done') return;
    if (!blobContainerRef.current) return;

    // Ensure all words are visible
    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    words.forEach((word) => {
      (word as HTMLElement).style.opacity = '1';
    });
  }, [phase]);

  // Derive visibility from React state — no GSAP for initial render
  const showSpiral = phase === 'spiral' || phase === 'transitioning';
  const showBlob = phase === 'transitioning' || phase === 'blob' || phase === 'done';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#6a3f33] [clip-path:inset(0)] ${showBlob ? 'max-sm:[clip-path:none]' : ''}`}
    >
      {/* Spiral Lottie Animation — visibility controlled by React state */}
      {showSpiral && (
        <div
          ref={spiralContainerRef}
          data-testid="spiral-container"
          className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
          style={{ opacity: phase === 'spiral' ? 1 : undefined }}
        >
          {/* translateZ(0) on this inner wrapper — not on spiralContainerRef — promotes the
              canvas to its own GPU tile without triggering the WebKit checkerboard artifact.
              The parent no longer uses overflow:hidden (replaced with clip-path:inset(0))
              so there is no compositor paint barrier between the background and the canvas. */}
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
              // freezeOnOffscreen defaults to true and uses IntersectionObserver to pause
              // the animation when "off-screen". On Safari, IntersectionObserver incorrectly
              // reports a canvas inside overflow:hidden + position:fixed as not intersecting,
              // so the animation is frozen immediately before drawing a single frame.
              // Disabling this ensures the animation always plays regardless of IO state.
              renderConfig={{ freezeOnOffscreen: false }}
              dotLottieRefCallback={(dotLottie: DotLottie) => {
                if (!dotLottie) return;
                dotLottie.addEventListener('complete', handleLottieComplete);
                // 'load' fires once WASM is initialised and the animation is playing.
                // At that point we know the renderer is alive — reset the fallback to a
                // generous safety net so a confirmed-running animation is never cut short.
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

      {/* Blob message — visibility controlled by React state */}
      {showBlob && (
        <div
          ref={blobContainerRef}
          data-testid="blob-container"
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: phase === 'transitioning' ? 0 : 1, touchAction: 'none' }}
        >
          <div
            className="relative w-[680px] aspect-square max-w-none sm:w-[clamp(360px,min(95vw,75dvh),760px)] sm:aspect-auto sm:h-[clamp(360px,min(95vw,75dvh),760px)]"
          >
            {/* Organic Blob Shape - SVG */}
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
              {/* Text Content */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
                style={{
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
