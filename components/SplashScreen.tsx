'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '@/public/spiral_animation.json';

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
  const words = text.split(' ');
  return (
    <p className={className} style={style}>
      {words.map((word, index) => (
        <span key={index} className="splash-word" style={{ opacity: 0.2 }}>
          {word}
          {index < words.length - 1 ? ' ' : ''}
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
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isCompleting = useRef(false);
  const lottieCompletedRef = useRef(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const absoluteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React state for phase tracking - controls what RENDERS, not styles
  const [phase, setPhase] = useState<'spiral' | 'blob' | 'done'>('spiral');
  const [blobReady, setBlobReady] = useState(false);
  const [wordsComplete, setWordsComplete] = useState(false);
  const observerRef = useRef<Observer | null>(null);
  const currentWordIndexRef = useRef(0);
  const totalWordsRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollCooldown = 80;
  const wordsPerScroll = 3;

  // Set --vh CSS variable for mobile viewport height
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    const timeoutId = setTimeout(setVh, 100);
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      clearTimeout(timeoutId);
    };
  }, []);

  // Use useLayoutEffect for initial GSAP setup - runs BEFORE browser paint
  // This prevents FOUC without needing React inline styles
  useLayoutEffect(() => {
    if (!spiralContainerRef.current || !blobContainerRef.current) return;
    
    // Set initial visibility before browser paints
    gsap.set(spiralContainerRef.current, { opacity: 1 });
    gsap.set(blobContainerRef.current, { opacity: 0 });
  }, []);

  // Main initialization effect - timeouts and fallbacks
  useEffect(() => {
    // Lottie fallback: skip to blob after timeout
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const fallbackDelay = isMobile ? 2000 : 6000;
    
    fallbackTimeoutRef.current = setTimeout(() => {
      if (!lottieCompletedRef.current) {
        handleLottieComplete();
      }
    }, fallbackDelay);

    // Absolute safety timeout: force splash completion after 30 seconds
    absoluteTimeoutRef.current = setTimeout(() => {
      if (!isCompleting.current) {
        setPhase('done');
        setWordsComplete(true);
        isCompleting.current = true;
        onCompleteSafe();
      }
    }, 30000);
    
    // Mobile safety: auto-reveal words after 10 seconds if stuck
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
    }, 10000);

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
      setWordsComplete(true);
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

    observerRef.current = Observer.create({
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
  }, [blobReady, wordsComplete, handleScrollReveal]);

  // Handle Lottie animation complete
  const handleLottieComplete = useCallback(() => {
    if (lottieCompletedRef.current) return;
    lottieCompletedRef.current = true;

    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    // Transition to blob phase via React state
    // This ensures React renders the correct visibility
    setPhase('blob');
  }, []);

  // When phase changes to 'blob', animate the transition
  useEffect(() => {
    if (phase !== 'blob') return;
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Fade out spiral
    tl.to(spiralContainerRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
    });

    // Fade in blob
    tl.to(
      blobContainerRef.current,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
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
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

    gsap.set(spiralContainerRef.current, { opacity: 0 });
    gsap.set(blobContainerRef.current, { opacity: 1 });
    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    gsap.set(words, { opacity: 1 });
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#6a3f33] overflow-hidden"
    >
      {/* Spiral Lottie Animation - NO React inline style for opacity */}
      <div
        ref={spiralContainerRef}
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
      >
        <div className="block w-full h-full max-w-[min(90vw,90vh)] max-h-[min(90vw,90vh)]">
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={true}
            style={{
              width: '100%',
              height: '100%',
            }}
            onComplete={handleLottieComplete}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid meet',
              progressiveLoad: true,
            }}
          />
        </div>
      </div>

      {/* Blob message - NO React inline style for opacity */}
      <div
        ref={blobContainerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="relative"
          style={{
            width: 'clamp(280px, 60vmin, 760px)',
            height: 'clamp(280px, 60vmin, 760px)',
          }}
        >
          {/* Organic Blob Shape - SVG */}
          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: 'url(/splash_blob.svg)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Text Content */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-left z-10"
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
                  fontSize: 'clamp(14px, 2.6vmin, 24px)',
                  marginBottom: 'clamp(8px, 2vw, 16px)',
                }}
              />
              <AnimatedText
                text="That is the Antar Smaran Process."
                className="leading-[1.3] text-[#4a3833]"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 2.6vmin, 24px)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
