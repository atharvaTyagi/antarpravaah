'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '@/public/spiral_animation.json';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
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
  const observerRef = useRef<Observer | null>(null);
  const isCompleting = useRef(false);
  const scrollProgress = useRef(0);
  const lottieCompleted = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !spiralContainerRef.current || !blobContainerRef.current) return;

    // Store original overflow values
    const originalOverflow = document.body.style.overflow;
    const originalOverflowHtml = document.documentElement.style.overflow;
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let autoCompleteTimer: ReturnType<typeof setTimeout>;

    // Set initial states
    gsap.set(spiralContainerRef.current, { opacity: 1 });
    gsap.set(blobContainerRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { opacity: 1 });

    const finishSplash = () => {
      if (isCompleting.current) return;
      isCompleting.current = true;
      
      // Kill observer first to stop intercepting events
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
      
      // Restore scroll immediately
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Disable pointer events on container
      if (containerRef.current) {
        containerRef.current.style.pointerEvents = 'none';
      }
      
      // Hide container
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          onCompleteSafe();
        },
      });
    };

    // Create timeline for scroll-controlled transitions
    const tl = gsap.timeline({
      paused: true,
      onComplete: finishSplash,
    });

    // Phase 1: Fade out spiral
    tl.to(spiralContainerRef.current, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut',
    });

    // Phase 2: Fade in blob (starts after spiral begins fading)
    tl.to(
      blobContainerRef.current,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut',
      },
      '-=1'
    );

    // Phase 3: Hold blob visible (give user time to read)
    tl.to({}, { duration: 2 });

    // Phase 4: Fade out blob and container
    tl.to(blobContainerRef.current, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut',
    });

    timelineRef.current = tl;

    const handleScroll = (direction: number) => {
      // Allow scrolling anytime - no waiting for Lottie
      if (isCompleting.current || !timelineRef.current) return;

      // Increment scroll progress (each scroll = 15% of timeline for smoother transitions)
      scrollProgress.current += direction * 0.15;
      scrollProgress.current = Math.max(0, Math.min(1, scrollProgress.current));

      // Update timeline progress smoothly
      gsap.to(timelineRef.current, {
        progress: scrollProgress.current,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    // Handle scroll/swipe with GSAP Observer - attach to container only
    const observer = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => handleScroll(-1),
      onUp: () => handleScroll(1),
      tolerance: 10,
      preventDefault: true,
    });

    observerRef.current = observer;

    // Failsafe: auto-complete after timeout
    autoCompleteTimer = setTimeout(() => {
      if (isCompleting.current || !timelineRef.current) return;
      // Mark lottie as complete and auto-finish
      lottieCompleted.current = true;
      gsap.to(timelineRef.current, {
        progress: 1,
        duration: 2,
        ease: 'power2.inOut',
      });
    }, 15000);

    // Cleanup function
    return () => {
      clearTimeout(autoCompleteTimer);
      
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
      
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      
      // Restore scroll
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalOverflowHtml;
    };
  }, [onCompleteSafe]);

  // Handle Lottie animation complete
  const handleLottieComplete = () => {
    lottieCompleted.current = true;
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
          {/* Organic Blob Shape - Static, no animation */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: '#cd9777',
              borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
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
              <p
                className="leading-[1.3] text-[#4a3833] mb-3"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 2.6vmin, 24px)',
                  marginBottom: 'clamp(8px, 2vw, 16px)',
                }}
              >
                If we only remembered who we are, and why we are here, then life and
                everything that has happened in it, would make sense. We will no
                longer be lost or alone. We were, are and shall always be whole.
              </p>
              <p
                className="leading-[1.3] text-[#4a3833]"
                style={{ 
                  fontFamily: 'var(--font-saphira), serif',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 2.6vmin, 24px)',
                }}
              >
                That is the Antar Smaran Process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
