'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

// Original spiral path data from splash_vector.svg
const SPIRAL_PATH = "M172.749 161.956C159.425 163.518 143.716 159.548 132.624 159.933C122.037 160.296 108.306 172.602 111.626 186.645C112.583 190.692 115.166 194.211 118.288 196.95C125.027 202.866 134.119 205.362 143.023 206.396C198.628 212.797 240.248 164.981 241.579 111.127C243.755 23.1709 116.892 10.623 55.8242 36.6535C37.1904 44.5935 20.0408 57.0424 0 60.0557C3.60581 47.2659 15.0279 38.3801 26.384 31.4958C88.4634 -6.11484 196.66 -16.9471 252.869 37.8522C297.579 81.4343 282.067 158.47 242.271 200.062C223.132 220.066 197.253 233.713 169.803 237.189C129.908 242.236 74.3699 223.893 69.1371 177.704C63.9152 131.582 115.452 99.3819 156.853 104.397C168.066 105.749 179.488 109.345 187.546 117.263C195.604 125.181 199.397 138.158 194.252 148.221C189.602 157.326 181.72 160.89 172.749 161.945V161.956Z";

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const onCompleteSafe = typeof onComplete === 'function' ? onComplete : () => {};
  const [spiralReveal, setSpiralReveal] = useState(0); // 0 = hidden, 100 = fully revealed
  const [spiralOpacity, setSpiralOpacity] = useState(1); // for fade out after reveal
  const [blobOpacity, setBlobOpacity] = useState(0); // hidden on load
  const [splashOpacity, setSplashOpacity] = useState(1); // fades out at the end
  const [isVisible, setIsVisible] = useState(true); // unmount after fade-out
  const isCompleting = useRef(false);
  const scrollAmount = useRef(0);
  
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

    // Handle wheel events to trigger animation sequence
    const handleWheel = (e: WheelEvent) => {
      if (!isVisible || isCompleting.current) return;
      
      e.preventDefault();
      e.stopPropagation();
      scrollAmount.current += Math.abs(e.deltaY);
      
      const s = scrollAmount.current;

      // Phase 1: Draw spiral (0 -> spiralDrawEnd)
      if (s <= spiralDrawEnd) {
        const t = s / spiralDrawEnd;
        setSpiralReveal(t * 100); // 0% to 100%
        setSpiralOpacity(1);
        setBlobOpacity(0);
        setSplashOpacity(1);
        return;
      }

      // Phase 2: Hold spiral fully visible (spiralDrawEnd -> spiralHoldEnd)
      if (s <= spiralHoldEnd) {
        setSpiralReveal(100);
        setSpiralOpacity(1);
        setBlobOpacity(0);
        setSplashOpacity(1);
        return;
      }

      // Phase 3: Fade out spiral (spiralHoldEnd -> spiralFadeEnd)
      if (s <= spiralFadeEnd) {
        const t = (s - spiralHoldEnd) / (spiralFadeEnd - spiralHoldEnd);
        setSpiralReveal(100);
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
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      // Cleanup: restore scroll
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalOverflowHtml;
      window.removeEventListener('wheel', handleWheel);
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
      {/* Spiral with draw animation */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-16"
        style={{
          opacity: spiralOpacity,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        <svg
          viewBox="0 0 280 238"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="block"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'min(100%, 100vh)',
            maxHeight: 'min(100%, 100vh)',
          }}
        >
          <defs>
            {/* Clip path for reveal animation */}
            <clipPath id="spiral-clip">
              <rect 
                x="0" 
                y="0" 
                width={`${(spiralReveal / 100) * 280}`} 
                height="238" 
              />
            </clipPath>
          </defs>
          
          {/* Animated path - revealed via clip-path */}
          <path
            d={SPIRAL_PATH}
            fill="#cd9777"
            clipPath="url(#spiral-clip)"
          />
        </svg>
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
