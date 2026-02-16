'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from '@/components/Button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',
  fgHover: '#d6c68e',
  bgHover: '#645c42',
};

// Helper component to render text with word-by-word spans (exactly like SplashScreen)
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

// Full text content for the blob
const blobContent = {
  opening: "Come and find me....",
  lines: [
    "Find me when you have lost track of your path,",
    "When you have forgotten what you like and dislike,",
    "When you are bored of always seeking people to fill the emptiness you feel within,",
    "When your body hurts and you can't take it no more,",
    "When you feel purposeless and joyless,",
    "When this life seems alien,",
    "When dealing with others drains your energy,",
    "When you cannot see the light in others and only the dark in yourself,",
    "Find me when no answer is good enough,",
    "When you have been to enough people seeking to get clarity about your life,",
  ],
  closing: "Find me when you are ready to find yourself.",
};

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
  const observerRef = useRef<Observer | null>(null);
  const currentWordIndexRef = useRef(0);
  const totalWordsRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const hasCompletedOnceRef = useRef(false); // Persists - once revealed, stays revealed
  const scrollCooldown = 80;
  const wordsPerScroll = 3;
  
  const [isClient, setIsClient] = useState(false);
  const [wordsComplete, setWordsComplete] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll to reveal words (like SplashScreen)
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

    // Check if all words are revealed
    if (currentWordIndexRef.current >= words.length) {
      hasCompletedOnceRef.current = true; // Mark permanently completed
      // Safety: Ensure ALL words are at full opacity
      gsap.to(words, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          setWordsComplete(true);
          onScrollLockChange?.(false); // Unlock scroll
          // Reveal CTA button
          const ctaButton = blobContainerRef.current?.querySelector('.blob-cta-button');
          if (ctaButton) {
            gsap.to(ctaButton, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
          onAnimationComplete?.();
        }
      });
    }
  }, [onAnimationComplete, onScrollLockChange]);

  // Setup GSAP Observer when section becomes active
  useEffect(() => {
    if (!isActive || !isClient || !blobContainerRef.current) return;

    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    const ctaButton = blobContainerRef.current.querySelector('.blob-cta-button');
    totalWordsRef.current = words.length;

    // If already completed once, show final state immediately - no lock, no reset
    if (hasCompletedOnceRef.current) {
      gsap.set(words, { opacity: 1 });
      gsap.set(ctaButton, { opacity: 1 });
      currentWordIndexRef.current = words.length;
      setWordsComplete(true);
      // Don't lock scroll - already complete

      // Still create Observer for navigation only
      observerRef.current = Observer.create({
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 30,
        preventDefault: true,
        onDown: () => { onEdgeReached?.('start'); },
        onUp: () => { onEdgeReached?.('end'); },
      });

      return () => {
        if (observerRef.current) {
          observerRef.current.kill();
          observerRef.current = null;
        }
      };
    }

    // First time: reset and lock for scroll reveal
    currentWordIndexRef.current = 0;
    setWordsComplete(false);
    onScrollLockChange?.(true);
    
    gsap.set(words, { opacity: 0.2 });
    gsap.set(ctaButton, { opacity: 0 });

    // Create Observer for scroll-based reveal
    observerRef.current = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 30,
      preventDefault: true,
      onDown: () => {
        // Scrolling up - go to previous section if at start
        if (currentWordIndexRef.current === 0) {
          onEdgeReached?.('start');
        }
      },
      onUp: () => {
        // Scrolling down - reveal words or go to next section
        if (hasCompletedOnceRef.current) {
          onEdgeReached?.('end');
        } else {
          handleScrollReveal();
        }
      },
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
      onScrollLockChange?.(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isClient]);

  // Handle reset to start - respect hasCompletedOnce
  useEffect(() => {
    if (!resetToStart || !isClient || !blobContainerRef.current) return;
    
    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    const ctaButton = blobContainerRef.current.querySelector('.blob-cta-button');
    
    // If already completed once, keep showing final state
    if (hasCompletedOnceRef.current) {
      gsap.set(words, { opacity: 1 });
      gsap.set(ctaButton, { opacity: 1 });
      currentWordIndexRef.current = words.length;
      setWordsComplete(true);
    } else {
      gsap.set(words, { opacity: 0.2 });
      gsap.set(ctaButton, { opacity: 0 });
      currentWordIndexRef.current = 0;
      setWordsComplete(false);
    }
  }, [resetToStart, isClient]);

  // Handle reset to end
  useEffect(() => {
    if (!resetToEnd || !isClient || !blobContainerRef.current) return;
    
    const words = blobContainerRef.current.querySelectorAll('.splash-word');
    const ctaButton = blobContainerRef.current.querySelector('.blob-cta-button');
    
    gsap.set(words, { opacity: 1 });
    gsap.set(ctaButton, { opacity: 1 });
    currentWordIndexRef.current = words.length;
    hasCompletedOnceRef.current = true;
    setWordsComplete(true);
  }, [resetToEnd, isClient]);

  return (
    <div
      ref={sectionRef}
      className="therapies-blob-scroll relative w-full h-full flex items-center justify-center overflow-visible py-4 sm:py-6 lg:py-8"
    >
      {/* Blob with text - fills the section */}
      <div ref={blobContainerRef} className="relative flex items-center justify-center w-full h-full max-h-full">
        {/* Text blob shape container - mobile: wider fixed width, desktop: viewport-based */}
        <div className="relative flex items-center justify-center max-h-full w-full">
          {/* Background SVG shape - mobile: wider than viewport, desktop: contained */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[680px] sm:w-[min(90vw,85vh)] lg:w-[min(85vw,80vh)] h-auto max-w-none"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)',
            }}
          />
          
          {/* Text content overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-[12%] sm:px-[14%] lg:px-[15%] py-[8%] sm:py-[9%] lg:py-[10%]">
            <div className="flex flex-col items-center justify-center text-center max-w-[95%] sm:max-w-[92%] lg:max-w-[90%] gap-[clamp(6px,1.2vh,16px)]">
              {/* Opening Title */}
              <AnimatedText
                text={blobContent.opening}
                className="leading-tight text-[#645c42] text-[28px] sm:text-[clamp(24px,4vmin,42px)]"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                }}
              />

              {/* Text Lines */}
              <div
                className="leading-[1.4] text-[#645c42] text-[13px] sm:text-[clamp(12px,1.8vmin,18px)]"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                }}
              >
                {blobContent.lines.map((line, index) => (
                  <AnimatedText
                    key={index}
                    text={line}
                  />
                ))}
              </div>

              {/* Closing Title */}
              <AnimatedText
                text={blobContent.closing}
                className="leading-tight text-[#645c42] mt-[clamp(6px,1.2vh,16px)] text-[22px] sm:text-[clamp(20px,3.5vmin,36px)]"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                }}
              />

              {/* CTA Button - starts hidden */}
              <div
                className="blob-cta-button mt-[clamp(12px,2vh,24px)]"
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
