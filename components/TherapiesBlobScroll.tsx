'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from './Button';

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

// Text lines for the blob section
const blobTextLines = [
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
];

interface TherapiesBlobScrollProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

export default function TherapiesBlobScroll({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
}: TherapiesBlobScrollProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const blobContainerRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Total steps: opening title + text lines + closing title + CTA = textLines.length + 3
  const totalSteps = blobTextLines.length + 3;

  // Cooldown between step changes
  const scrollCooldown = 400;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reset to start
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    activeIndexRef.current = 0;
    setActiveIndex(0);
    lastScrollTimeRef.current = Date.now();
  }, [resetToStart, isClient]);

  // Handle reset to end
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    const lastIndex = totalSteps - 1;
    activeIndexRef.current = lastIndex;
    setActiveIndex(lastIndex);
    lastScrollTimeRef.current = Date.now();
  }, [resetToEnd, isClient, totalSteps]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive]);

  // Setup Observer-based scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!blobContainerRef.current) return;

    const handleScroll = (direction: 'up' | 'down') => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (animatingRef.current) return;

      const currentIndex = activeIndexRef.current;

      if (direction === 'down') {
        if (currentIndex < totalSteps - 1) {
          animatingRef.current = true;
          activeIndexRef.current = currentIndex + 1;
          setActiveIndex(currentIndex + 1);
          setTimeout(() => {
            animatingRef.current = false;
            lastScrollTimeRef.current = Date.now();
          }, 500);
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('end');
        }
      } else {
        if (currentIndex > 0) {
          animatingRef.current = true;
          activeIndexRef.current = currentIndex - 1;
          setActiveIndex(currentIndex - 1);
          setTimeout(() => {
            animatingRef.current = false;
            lastScrollTimeRef.current = Date.now();
          }, 500);
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('start');
        }
      }
    };

    // Create Observer for scroll handling - starts disabled
    const blobObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    blobObserver.disable();
    observerRef.current = blobObserver;

    return () => {
      blobObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, onEdgeReached, totalSteps]);

  // Calculate opacity for each element based on active index
  const getOpacity = (elementIndex: number) => {
    if (elementIndex <= activeIndex) return 1;
    return 0.2;
  };

  // Check if CTA should be visible (last step)
  const showCTA = activeIndex >= totalSteps - 1;

  return (
    <div
      ref={sectionRef}
      className="therapies-blob-scroll relative w-full h-full flex items-center justify-center overflow-visible"
    >
      {/* Blob with text */}
      <div ref={blobContainerRef} className="relative flex items-center justify-center">
        {/* Text blob shape container */}
        <div className="relative flex items-center justify-center">
          {/* Background SVG shape */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[485px] sm:w-[400px] md:w-[480px] lg:w-[560px] h-auto max-w-none"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)',
            }}
          />
          
          {/* Text content overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex flex-col items-center justify-center text-center max-w-[320px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[400px] gap-2">
              {/* Opening Title */}
              <h2
                className="text-[24px] sm:text-[20px] md:text-[24px] lg:text-[28px] leading-tight text-[#645c42] mb-2 transition-opacity duration-500"
                style={{
                  fontFamily: 'var(--font-saphira), serif',
                  opacity: getOpacity(0),
                }}
              >
                Come and find me....
              </h2>

              {/* Text Lines */}
              <div
                className="text-[12px] sm:text-[11px] md:text-[12px] lg:text-[14px] leading-[1.4] text-[#645c42]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {blobTextLines.map((line, index) => (
                  <p
                    key={index}
                    className="transition-opacity duration-500 mb-0.5"
                    style={{ opacity: getOpacity(index + 1) }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Closing Title */}
              <h2
                className="text-[20px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-tight text-[#645c42] mt-2 transition-opacity duration-500"
                style={{
                  fontFamily: 'var(--font-saphira), serif',
                  opacity: getOpacity(blobTextLines.length + 1),
                }}
              >
                Find me when you are ready to find yourself.
              </h2>

              {/* CTA Button */}
              <div
                className="mt-3 transition-opacity duration-500"
                style={{ opacity: showCTA ? 1 : 0 }}
              >
                <button
                  className="group inline-flex items-center justify-center gap-2 p-2 text-[#645c42] hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  {/* Left Arrow */}
                  <svg
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-4 shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-center text-[14px] tracking-[2px] uppercase leading-tight">
                    <span className="block">Book</span>
                    <span className="block">Your First</span>
                    <span className="block">Session</span>
                  </span>
                  {/* Right Arrow */}
                  <svg
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-4 shrink-0"
                    aria-hidden
                  >
                    <path
                      d="M2.69019 9.10567C2.68288 9.10558 2.67611 9.10574 2.66866 9.10526C2.64795 9.10457 2.62575 9.10222 2.60966 9.0899C2.57463 9.06362 2.58486 9.01034 2.59955 8.96862C2.75564 8.52544 3.05753 8.18017 3.3305 7.79866C3.60348 7.41714 3.86931 7.01367 4.0848 6.59226C4.4115 5.95438 4.76304 5.00818 4.683 4.30464C4.58386 3.42752 4.04831 2.58576 3.52743 1.89555C3.39042 1.71389 2.52974 0.922658 2.56292 0.73448C2.61044 0.464118 3.46981 1.05424 3.60385 1.13789C5.1795 2.11502 6.35612 3.57618 5.84566 5.50449C5.82333 5.58856 5.79992 5.67214 5.77461 5.7555C5.63391 6.22345 5.45951 6.69259 5.13169 7.07999C4.84308 7.42154 4.53417 7.74786 4.20756 8.05588C3.9726 8.27765 3.72818 8.49047 3.47551 8.69263C3.24182 8.87993 3.01363 9.10285 2.68978 9.1045L2.69019 9.10567Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7.87036 9.10567C7.86305 9.10558 7.85628 9.10574 7.84884 9.10526C7.82812 9.10457 7.80592 9.10222 7.78983 9.0899C7.75481 9.06362 7.76504 9.01034 7.77972 8.96862C7.93582 8.52544 8.23771 8.18017 8.51068 7.79866C8.78365 7.41714 9.04948 7.01367 9.26498 6.59226C9.59168 5.95438 9.94321 5.00818 9.86317 4.30464C9.76403 3.42752 9.22849 2.58576 8.70761 1.89555C8.5706 1.71389 7.70991 0.922658 7.7431 0.73448C7.79062 0.464118 8.64998 1.05424 8.78402 1.13789C10.3597 2.11502 11.5363 3.57618 11.0258 5.50449C11.0035 5.58856 10.9801 5.67214 10.9548 5.7555C10.8141 6.22345 10.6397 6.69259 10.3119 7.07999C10.0233 7.42154 9.71435 7.74786 9.38774 8.05588C9.15278 8.27765 8.90835 8.49047 8.65569 8.69263C8.422 8.87993 8.19381 9.10285 7.86996 9.1045L7.87036 9.10567Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
