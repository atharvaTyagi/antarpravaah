'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

  // Scroll-based word reveal state
  const [blobReady, setBlobReady] = useState(false);
  const [wordsComplete, setWordsComplete] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false); // Prevents resets after completion
  const observerRef = useRef<Observer | null>(null);
  const currentWordIndexRef = useRef(0);
  const totalWordsRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollCooldown = 80; // ms between word reveals
  const wordsPerScroll = 3; // Reveal multiple words per scroll for smoother reading

  // Set --vh CSS variable for mobile viewport height (handles mobile browser UI)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    
    // Set after a delay to ensure DOM is ready
    const timeoutId = setTimeout(setVh, 100);
    
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      clearTimeout(timeoutId);
    };
  }, []);

  // Separate effect for sequence complete state
  useEffect(() => {
    if (!sequenceComplete) return;
    if (!containerRef.current || !spiralContainerRef.current || !blobContainerRef.current) return;

    gsap.set(spiralContainerRef.current, { opacity: 0, display: 'none' });
    gsap.set(blobContainerRef.current, { opacity: 1, display: 'flex' });
    gsap.set(containerRef.current, { opacity: 1 });
    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    gsap.set(words, { opacity: 1 });
  }, [sequenceComplete]);

  // Main initialization effect - only runs once
  useEffect(() => {
    if (!containerRef.current || !spiralContainerRef.current || !blobContainerRef.current) return;
    
    // Skip if already complete
    if (sequenceComplete) return;

    // Set initial states - only on first mount
    gsap.set(spiralContainerRef.current, { opacity: 1, display: 'flex' });
    gsap.set(blobContainerRef.current, { opacity: 0, display: 'flex' });
    gsap.set(containerRef.current, { opacity: 1 });

    // Fallback: if Lottie doesn't complete within 6 seconds, skip to blob
    fallbackTimeoutRef.current = setTimeout(() => {
      if (!lottieCompletedRef.current) {
        handleLottieComplete();
      }
    }, 6000);

    // Absolute safety timeout: force splash completion after 30 seconds
    absoluteTimeoutRef.current = setTimeout(() => {
      if (!isCompleting.current) {
        if (blobContainerRef.current) {
          const words = blobContainerRef.current.querySelectorAll('.splash-word');
          gsap.set(words, { opacity: 1 });
        }
        setWordsComplete(true);
        setSequenceComplete(true);
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
  }, []); // Only run once on mount

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

    // Reveal the next batch of words
    for (let i = currentIndex; i < endIndex; i++) {
      gsap.to(words[i], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    currentWordIndexRef.current = endIndex;

    // Check if all words are revealed
    if (currentWordIndexRef.current >= words.length) {
      setWordsComplete(true);
      setSequenceComplete(true); // Mark sequence as complete to prevent resets
      // Brief pause then signal completion
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

  // Setup GSAP Observer when blob is ready (and not yet complete)
  useEffect(() => {
    if (!blobReady || wordsComplete || typeof window === 'undefined') return;

    // Create Observer for scroll-based word reveal
    observerRef.current = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onDown: () => {}, // Scroll up does nothing during word reveal
      onUp: () => handleScrollReveal(), // Scroll down reveals words
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
    };
  }, [blobReady, wordsComplete, handleScrollReveal]);

  // Handle Lottie animation complete - this triggers the rest of the sequence
  const handleLottieComplete = useCallback(() => {
    if (lottieCompletedRef.current) {
      return; // Prevent double execution
    }
    
    lottieCompletedRef.current = true;

    // Clear fallback timeout if it exists
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    if (!spiralContainerRef.current || !blobContainerRef.current) {
      return;
    }

    // Kill any existing timeline to prevent conflicts
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create the automatic transition timeline
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Phase 1: Fade out spiral
    tl.to(spiralContainerRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
    });

    // Phase 2: Fade in blob (overlaps with spiral fade out)
    tl.to(
      blobContainerRef.current,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Setup scroll-based word reveal after blob is visible
          if (blobContainerRef.current) {
            const words = blobContainerRef.current.querySelectorAll('.splash-word');
            totalWordsRef.current = words.length;
            currentWordIndexRef.current = 0;

            if (words.length > 0) {
              // Enable scroll-based reveal
              setBlobReady(true);
            } else {
              // No words, just complete
              if (!isCompleting.current) {
                isCompleting.current = true;
                onCompleteSafe();
              }
            }
          } else {
            if (!isCompleting.current) {
              isCompleting.current = true;
              onCompleteSafe();
            }
          }
        },
      },
      '-=0.4'
    );
  }, [onCompleteSafe]);


  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#6a3f33] overflow-hidden"
      style={{ minHeight: '100%', opacity: 1 }}
    >
      {/* Spiral Lottie Animation */}
      <div
        ref={spiralContainerRef}
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
        style={{ opacity: sequenceComplete ? 0 : 1 }}
      >
        <div
          className="block w-full h-full max-w-[min(90vw,90vh)] max-h-[min(90vw,90vh)]"
        >
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

      {/* Blob message (full-screen moment; blob itself centered) */}
      <div
        ref={blobContainerRef}
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{ opacity: sequenceComplete ? 1 : 0 }}
      >
        <div
          className="relative w-full h-full max-w-[760px] max-h-[760px]"
          style={{
            minWidth: 'min(320px, 90vw)',
            minHeight: 'min(320px, 90vh)',
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
