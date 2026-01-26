'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '@/public/spiral_animation.json';

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
  const wordAnimationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current || !spiralContainerRef.current || !blobContainerRef.current) return;

    // Store original overflow values
    const originalOverflow = document.body.style.overflow;
    const originalOverflowHtml = document.documentElement.style.overflow;
    
    // Disable body scroll during splash
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Set initial states
    gsap.set(spiralContainerRef.current, { opacity: 1 });
    gsap.set(blobContainerRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { opacity: 1 });

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      
      if (wordAnimationRef.current) {
        wordAnimationRef.current.kill();
        wordAnimationRef.current = null;
      }
      
      // Restore scroll
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalOverflowHtml;
    };
  }, [onCompleteSafe]);

  // Handle Lottie animation complete - this triggers the rest of the sequence
  const handleLottieComplete = () => {
    if (!spiralContainerRef.current || !blobContainerRef.current) return;

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
          // Start word-by-word animation after blob is visible
          if (blobContainerRef.current) {
            const words = blobContainerRef.current.querySelectorAll('.splash-word');
            if (words.length > 0) {
              // Kill any existing word animation
              if (wordAnimationRef.current) {
                wordAnimationRef.current.kill();
              }
              
              // Create word-by-word reveal animation (comfortable reading pace)
              wordAnimationRef.current = gsap.timeline({
                onComplete: () => {
                  // Brief pause after text completes, then finish splash
                  gsap.delayedCall(0.8, finishSplash);
                }
              });
              wordAnimationRef.current.to(words, {
                opacity: 1,
                duration: 0.5,
                stagger: 0.22,
                ease: 'power2.out',
              });
            }
          }
        },
      },
      '-=0.4'
    );

    const finishSplash = () => {
      if (isCompleting.current) return;
      isCompleting.current = true;
      
      // Restore scroll
      document.body.style.overflow = '';  
      document.documentElement.style.overflow = '';
      
      // Disable pointer events
      if (containerRef.current) {
        containerRef.current.style.pointerEvents = 'none';
      }
      
      // Fade out splash screen smoothly
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          onCompleteSafe();
        },
      });
    };
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#6a3f33]"
      style={{ 
        width: '100vw',
        height: '100vh',
        pointerEvents: 'auto',
      }}
    >
      {/* Spiral Lottie Animation */}
      <div
        ref={spiralContainerRef}
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
      >
        <div
          className="block"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'min(100%, 100vh)',
            maxHeight: 'min(100%, 100vh)',
          }}
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
          />
        </div>
      </div>

      {/* Blob message (full-screen moment; blob itself centered) */}
      <div
        ref={blobContainerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="relative"
          style={{
            width: 'clamp(380px, 60vmin, 760px)',
            height: 'clamp(380px, 60vmin, 760px)',
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
