'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Button from '@/components/Button';

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
}

export default function TherapiesBlobScroll({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
  onCtaClick,
  onAnimationComplete,
}: TherapiesBlobScrollProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const blobContainerRef = useRef<HTMLDivElement | null>(null);
  const wordAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const hasAnimatedOnceRef = useRef(false); // Never resets - tracks if animation ever completed
  const [isClient, setIsClient] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reset to start - but if already animated once, show final state instead
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    // Kill any existing animation
    if (wordAnimationRef.current) {
      wordAnimationRef.current.kill();
      wordAnimationRef.current = null;
    }
    
    if (blobContainerRef.current) {
      const words = blobContainerRef.current.querySelectorAll('.splash-word');
      const ctaButton = blobContainerRef.current.querySelector('.blob-cta-button');
      
      // If animation has already completed once, keep showing final state
      if (hasAnimatedOnceRef.current) {
        gsap.set(words, { opacity: 1 });
        gsap.set(ctaButton, { opacity: 1 });
      } else {
        // Only reset to initial state if animation has never completed
        gsap.set(words, { opacity: 0.2 });
        gsap.set(ctaButton, { opacity: 0 });
      }
    }
  }, [resetToStart, isClient]);

  // Handle reset to end - show everything
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    // Kill any existing animation
    if (wordAnimationRef.current) {
      wordAnimationRef.current.kill();
      wordAnimationRef.current = null;
    }
    
    if (blobContainerRef.current) {
      const words = blobContainerRef.current.querySelectorAll('.splash-word');
      const ctaButton = blobContainerRef.current.querySelector('.blob-cta-button');
      
      gsap.set(words, { opacity: 1 });
      gsap.set(ctaButton, { opacity: 1 });
    }
    
    // Mark as animated if coming from earlier section
    if (!hasAnimatedOnceRef.current) {
      hasAnimatedOnceRef.current = true;
      setAnimationComplete(true);
    }
  }, [resetToEnd, isClient]);

  // Auto-animate when section becomes active (exactly like SplashScreen)
  useEffect(() => {
    if (!isActive || !isClient || !blobContainerRef.current) return;
    if (hasAnimatedOnceRef.current) {
      // Already animated once - just ensure final state is shown
      const container = blobContainerRef.current;
      const words = container.querySelectorAll('.splash-word');
      const ctaButton = container.querySelector('.blob-cta-button');
      gsap.set(words, { opacity: 1 });
      gsap.set(ctaButton, { opacity: 1 });
      setAnimationComplete(true);
      return;
    }
    
    // Kill any existing animation
    if (wordAnimationRef.current) {
      wordAnimationRef.current.kill();
      wordAnimationRef.current = null;
    }

    const container = blobContainerRef.current;
    const words = container.querySelectorAll('.splash-word');
    const ctaButton = container.querySelector('.blob-cta-button');

    if (words.length === 0) return;

    // Small delay to ensure DOM is ready, then start word animation
    // (exactly like SplashScreen does after blob fades in)
    const startAnimation = () => {
      // Create word-by-word reveal animation (same params as SplashScreen)
      wordAnimationRef.current = gsap.timeline({
        onComplete: () => {
          // Animate CTA button after words complete
          gsap.to(ctaButton, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              hasAnimatedOnceRef.current = true; // Mark as permanently animated
              setAnimationComplete(true);
              onAnimationComplete?.();
            }
          });
        }
      });
      
      // Animate words from 0.2 to 1 (exactly like SplashScreen)
      wordAnimationRef.current.to(words, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.12, // Slightly faster than splash (0.22) since we have more words
        ease: 'power2.out',
      });
    };

    // Use gsap.delayedCall to ensure DOM is ready (like SplashScreen's onComplete callback)
    gsap.delayedCall(0.3, startAnimation);

    return () => {
      if (wordAnimationRef.current) {
        wordAnimationRef.current.kill();
        wordAnimationRef.current = null;
      }
    };
  }, [isActive, isClient, onAnimationComplete]);

  // Handle scroll events when animation is complete to notify parent
  useEffect(() => {
    if (!isActive || !animationComplete || !isClient) return;

    const handleWheel = (e: WheelEvent) => {
      // After animation completes, allow scrolling to next/prev section
      if (e.deltaY > 0) {
        // Scrolling down - go to next section
        onEdgeReached?.('end');
      } else if (e.deltaY < 0) {
        // Scrolling up - go to previous section
        onEdgeReached?.('start');
      }
    };

    // Touch handling
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          onEdgeReached?.('end');
        } else {
          onEdgeReached?.('start');
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive, animationComplete, isClient, onEdgeReached]);

  return (
    <div
      ref={sectionRef}
      className="therapies-blob-scroll relative w-full h-full flex items-center justify-center overflow-visible"
    >
      {/* Blob with text - fills the section */}
      <div ref={blobContainerRef} className="relative flex items-center justify-center w-full h-full">
        {/* Text blob shape container - mobile: wider fixed width, desktop: viewport-based */}
        <div className="relative flex items-center justify-center">
          {/* Background SVG shape - mobile: wider than viewport, desktop: contained */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[520px] sm:w-[min(95vw,95vh)] sm:h-[min(95vw,95vh)] h-auto max-w-none sm:object-contain"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)',
            }}
          />
          
          {/* Text content overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-[12%] sm:px-[15%] py-[8%] sm:py-[10%]">
            <div className="flex flex-col items-center justify-center text-center max-w-[95%] sm:max-w-[90%] gap-[clamp(6px,1.2vh,16px)]">
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
