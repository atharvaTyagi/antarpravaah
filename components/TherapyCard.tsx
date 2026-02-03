'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Therapy, DescriptionItem } from '@/data/therapiesContent';
import Button from './Button';

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',      // Dark brown text in non-hovered state
  fgHover: '#d6c68e', // Light gold text on hover
  bgHover: '#645c42', // Dark brown background on hover
};

// Arrow icons for mobile CTA
function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
  );
}

interface TherapyCardProps {
  therapy: Therapy;
  isVisible?: boolean; // Trigger animation when section is active
  isMobile?: boolean; // Mobile layout variant
  onScrollEnd?: () => void; // Callback when content is scrolled to end
}

export default function TherapyCard({ therapy, isVisible = false, isMobile = false, onScrollEnd }: TherapyCardProps) {
  const isCenter = therapy.iconPosition === 'center';
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const bestForRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  // Track client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set initial state once on client mount
  useEffect(() => {
    if (!isClient || !cardRef.current) return;
    
    const elements = [
      iconRef.current,
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      bestForRef.current,
      durationRef.current,
      ctaRef.current,
    ].filter((el) => el !== null);

    if (elements.length === 0) return;

    // Set initial state - everything invisible (only once)
    gsap.set(elements, {
      opacity: 0,
      y: 20,
    });
  }, [isClient]);

  // Trigger animation when isVisible becomes true
  useEffect(() => {
    if (!isClient || !cardRef.current) return;
    if (!isVisible) return;
    if (hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const elements = [
      iconRef.current,
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      bestForRef.current,
      durationRef.current,
      ctaRef.current,
    ].filter((el) => el !== null);

    if (elements.length === 0) return;

    // Create timeline with slight delay for smooth appearance
    const tl = gsap.timeline({ delay: 0.3 });

    // Animate elements with stagger
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, [isClient, isVisible]);

  // Handle scroll detection for mobile ASP card
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
    setIsScrolledToEnd(isAtBottom);
  }, [isMobile]);

  // Touch scroll prevention for mobile ASP card
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      const touch = e.touches[0];
      const startY = (container as HTMLDivElement & { _startY?: number })._startY || touch.clientY;
      const deltaY = touch.clientY - startY;
      const isScrollingUp = deltaY > 0;
      const isScrollingDown = deltaY < 0;

      // Allow scroll within the container
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        // At boundary - stop propagation but don't prevent if we're at the end
        if (isAtBottom && isScrollingDown) {
          onScrollEnd?.();
        }
      }

      e.stopPropagation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      (container as HTMLDivElement & { _startY?: number })._startY = touch.clientY;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, onScrollEnd]);

  // Helper to render description based on type
  const renderDescription = () => {
    if (typeof therapy.description === 'string') {
      return (
        <p
          className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
        >
          {therapy.description}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-4 sm:gap-5">
        {therapy.description.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <p
                key={idx}
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {item}
              </p>
            );
          }
          const descItem = item as DescriptionItem;
          return (
            <div key={idx} className="flex flex-col gap-2 sm:gap-3">
              <p
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                {descItem.heading}
              </p>
              <p
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {descItem.text}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // Mobile ASP (centered) layout with scrollable content
  if (isCenter && isMobile) {
    return (
      <div 
        ref={cardRef} 
        className="w-full h-full bg-[#d6c68e] rounded-[24px] p-[40px] flex flex-col"
      >
        {/* Icon centered at top */}
        <div className="w-full flex justify-center shrink-0 mb-4">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="w-[240px] h-[120px] object-contain"
          />
        </div>

        {/* Title */}
        <h3
          className="text-[36px] leading-[1.0] text-[#645c42] text-center shrink-0 mb-4"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {therapy.title}
        </h3>

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div 
            className="text-[#645c42] text-[16px] leading-[24px] text-justify"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            {typeof therapy.description === 'string' ? (
              <p>{therapy.description}</p>
            ) : (
              therapy.description.map((item, idx) => {
                if (typeof item === 'string') {
                  return (
                    <p key={idx} className={idx < therapy.description.length - 1 ? 'mb-4' : ''}>
                      {item}
                    </p>
                  );
                }
                const descItem = item as DescriptionItem;
                return (
                  <div key={idx} className={idx < therapy.description.length - 1 ? 'mb-4' : ''}>
                    <p
                      className="text-[16px] mb-1"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                    >
                      {descItem.heading}
                    </p>
                    <p>{descItem.text}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* CTA Button inside scroll area */}
          <div className="mt-6 flex justify-center">
            <button
              className="group inline-flex items-center justify-center gap-2 p-3 text-[#645c42] hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              <ArrowLeft className="w-5 h-4 shrink-0" />
              <span className="text-center text-[18px] tracking-[2.88px] uppercase leading-tight">
                <span className="block">Experience</span>
                <span className="block">the Antar Smaran</span>
                <span className="block">Process</span>
              </span>
              <ArrowRight className="w-5 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCenter) {
    // Special layout for ASP (centered) - larger card with more padding (Desktop)
    return (
      <div ref={cardRef} className="w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[840px] bg-[#d6c68e] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-8 sm:p-12 lg:p-20 flex flex-col items-center justify-center gap-8 sm:gap-10 lg:gap-12 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        {/* Icon centered at top */}
        <div ref={iconRef} className="w-full flex justify-center">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="h-[140px] sm:h-[160px] lg:h-[186px] w-auto object-contain"
          />
        </div>

        {/* Content centered */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 items-center text-center max-w-full sm:max-w-[500px] lg:max-w-[600px] px-2">
          <h3
            ref={titleRef}
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <div ref={descriptionRef} className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-justify w-full">
            {renderDescription()}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-4 sm:mt-6">
            <Button text={therapy.ctaText} size="large" colors={therapiesButtonColors} />
          </div>
        </div>
      </div>
    );
  }

  // Standard layout - Figma design: Icon top-right, content on left
  return (
    <div ref={cardRef} className="w-full bg-[#d6c68e] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Content - takes most of the space */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <h3
            ref={titleRef}
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-tight text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <p
            ref={subtitleRef}
            className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#645c42] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {therapy.subtitle}
          </p>

          {/* Description */}
          <div ref={descriptionRef}>
            {renderDescription()}
          </div>

          {/* Best For section */}
          {therapy.bestFor.length > 0 && (
            <div ref={bestForRef} className="flex flex-col gap-1.5 sm:gap-2">
              <p
                className="text-[#645c42] text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.92px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Best For
              </p>
              <ul className="list-disc pl-5 sm:pl-6 flex flex-col gap-0.5 sm:gap-1">
                {therapy.bestFor.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#645c42] text-[11px] sm:text-[12px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Session Duration */}
          <div ref={durationRef} className="flex flex-col gap-0.5 sm:gap-1">
            <p
              className="text-[#645c42] text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.92px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Session Duration
            </p>
            <p
              className="text-[#645c42] text-[11px] sm:text-[12px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {therapy.duration}
            </p>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-1 sm:mt-2">
            <Button text={therapy.ctaText} size="small" colors={therapiesButtonColors} />
          </div>
        </div>

        {/* Icon - positioned on the right, aligned to top on desktop, centered on mobile */}
        <div ref={iconRef} className="shrink-0 w-full h-[140px] sm:h-[160px] lg:w-[200px] lg:h-[200px] flex items-center lg:items-start justify-center lg:pt-4">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
