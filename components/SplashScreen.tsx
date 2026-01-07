'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '@/public/spiral_animation.json';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const onCompleteSafe = typeof onComplete === 'function' ? onComplete : () => {};
  const [spiralOpacity, setSpiralOpacity] = useState(1); // for fade out after reveal
  const [blobOpacity, setBlobOpacity] = useState(0); // hidden on load
  const [splashOpacity, setSplashOpacity] = useState(1); // fades out at the end
  const [isVisible, setIsVisible] = useState(true); // unmount after fade-out
  const isCompleting = useRef(false);
  const scrollAmount = useRef(0);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  
  // Scroll thresholds for animation sequence
  const spiralDrawEnd = 200; // spiral draws in (0..200)
  const spiralHoldEnd = 260; // spiral stays visible (200..260)
  const spiralFadeEnd = 340; // spiral fades out (260..340)
  const blobFadeInEnd = 460; // blob fades in (340..460)
  const holdEnd = 520; // blob stays fully visible (460..520)
  const splashFadeOutEnd = 700; // blob+splash fade out (520..700)

  useEffect(() => {
    // Disable body scroll when splash is visible
    const originalOverflow = document.body.style.overflow;
    const originalOverflowHtml = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Shared function to update animation based on scroll amount
    const updateAnimationPhase = () => {
      const s = scrollAmount.current;

      // Phase 1: Draw spiral (0 -> spiralDrawEnd)
      if (s <= spiralDrawEnd) {
        setSpiralOpacity(1);
        setBlobOpacity(0);
        setSplashOpacity(1);
        return;
      }

      // Phase 2: Hold spiral fully visible (spiralDrawEnd -> spiralHoldEnd)
      if (s <= spiralHoldEnd) {
        setSpiralOpacity(1);
        setBlobOpacity(0);
        setSplashOpacity(1);
        return;
      }

      // Phase 3: Fade out spiral (spiralHoldEnd -> spiralFadeEnd)
      if (s <= spiralFadeEnd) {
        const t = (s - spiralHoldEnd) / (spiralFadeEnd - spiralHoldEnd);
        setSpiralOpacity(Math.max(0, 1 - t));
        setBlobOpacity(0);
        setSplashOpacity(1);
        return;
      }

      // Phase 4: Fade in blob (spiralFadeEnd -> blobFadeInEnd)
      if (s <= blobFadeInEnd) {
        const t = (s - spiralFadeEnd) / (blobFadeInEnd - spiralFadeEnd);
        setSpiralOpacity(0);
        setBlobOpacity(Math.min(1, t));
        setSplashOpacity(1);
        return;
      }

      // Phase 5: Hold blob (blobFadeInEnd -> holdEnd)
      if (s <= holdEnd) {
        setSpiralOpacity(0);
        setBlobOpacity(1);
        setSplashOpacity(1);
        return;
      }

      // Phase 6: Fade out everything (holdEnd -> splashFadeOutEnd)
      if (s <= splashFadeOutEnd) {
        const t = (s - holdEnd) / (splashFadeOutEnd - holdEnd);
        setSpiralOpacity(0);
        setBlobOpacity(Math.max(0, 1 - t));
        setSplashOpacity(Math.max(0, 1 - t));
        return;
      }

      // Finish: fade out completed -> reveal homepage
      if (!isCompleting.current) {
        isCompleting.current = true;
        setSpiralOpacity(0);
        setBlobOpacity(0);
        setSplashOpacity(0);

        // Let the opacity transition complete before unmounting / enabling scroll
        window.setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = originalOverflow;
          document.documentElement.style.overflow = originalOverflowHtml;
          onCompleteSafe();
        }, 500);
      }
    };

    // Handle wheel events for desktop
    const handleWheel = (e: WheelEvent) => {
      if (!isVisible || isCompleting.current) return;
      
      e.preventDefault();
      e.stopPropagation();
      scrollAmount.current += Math.abs(e.deltaY);
      updateAnimationPhase();
    };

    // Handle touch events for mobile/tablet
    const handleTouchStart = (e: TouchEvent) => {
      if (!isVisible || isCompleting.current) return;
      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVisible || isCompleting.current) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;
      
      // Accumulate scroll amount based on touch movement
      scrollAmount.current += Math.abs(deltaY);
      updateAnimationPhase();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      // Cleanup: restore scroll
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalOverflowHtml;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVisible, onCompleteSafe]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#6a3f33]"
      style={{ 
        width: '100vw',
        height: '100vh',
        pointerEvents: isVisible ? 'auto' : 'none',
        opacity: splashOpacity,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {/* Spiral Lottie Animation */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
        style={{
          opacity: spiralOpacity,
          transition: 'opacity 0.4s ease-out',
        }}
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
            animationData={animationData}
            loop={false}
            autoplay={true}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>

      {/* Blob message (full-screen moment; blob itself centered) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: blobOpacity,
          transition: 'opacity 0.6s ease-in-out',
        }}
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
    </motion.div>
  );
}
