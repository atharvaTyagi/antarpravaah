'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Button from './Button';

// Pathways page button colors matching the teal theme
const pathwaysButtonColors = {
  fg: '#9ac1bf', // Teal text in non-hovered state
  fgHover: '#354443', // Dark teal text on hover
  bgHover: '#9ac1bf', // Teal background on hover
};

// Arrow icons matching the Button component style
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

// Mobile CTA Button - 2 line text layout for better fit
function MobileCtaButton({ text, href, onClick }: { text: string; href?: string; onClick?: () => void }) {
  // Split text into 2 lines for mobile display
  // e.g., "Book a Private Session" -> ["Book a", "Private Session"]
  // e.g., "View Upcoming Immersions" -> ["View Upcoming", "Immersions"]
  // e.g., "Explore Training Programs" -> ["Explore Training", "Programs"]
  const getTextLines = (fullText: string): [string, string] => {
    const words = fullText.split(' ');
    if (words.length <= 2) {
      return [words[0] || '', words.slice(1).join(' ') || ''];
    }
    // Split roughly in half, preferring more words on first line
    const midpoint = Math.ceil(words.length / 2);
    return [
      words.slice(0, midpoint).join(' '),
      words.slice(midpoint).join(' ')
    ];
  };

  const [line1, line2] = getTextLines(text);

  const content = (
    <>
      <ArrowLeft className="w-7 h-5 shrink-0" />
      <span className="text-center text-[18px] tracking-[2.88px] uppercase leading-tight px-2 py-1">
        <span className="block">{line1}</span>
        <span className="block">{line2}</span>
      </span>
      <ArrowRight className="w-7 h-5 shrink-0" />
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="group inline-flex items-center justify-center gap-2 p-3 text-[#9ac1bf] hover:opacity-80 transition-opacity"
        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href || '#'}
      className="group inline-flex items-center justify-center gap-2 p-3 text-[#9ac1bf] hover:opacity-80 transition-opacity"
      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
    >
      {content}
    </Link>
  );
}

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  whatToExpect: string[];
  ctaText: string;
  ctaHref: string;
  image: string;
}

interface PathwayCardProps {
  pathway: Pathway;
  /** Whether to use mobile layout (expanded/collapsed states) */
  isMobile?: boolean;
  /** Callback when expanded state changes (for scroll locking) */
  onExpandedChange?: (expanded: boolean) => void;
  /** Optional callback for CTA button click (overrides href) */
  onCtaClick?: () => void;
}

export default function PathwayCard({ pathway, isMobile = false, onExpandedChange, onCtaClick }: PathwayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle expand/collapse
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    onExpandedChange?.(true);
  }, [onExpandedChange]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    onExpandedChange?.(false);
  }, [onExpandedChange]);

  // Prevent touch scroll from propagating when scrolling inside expanded card
  useEffect(() => {
    if (!isMobile || !isExpanded || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    
    const handleTouchMove = (e: TouchEvent) => {
      // Check if we're at scroll boundaries
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Get touch direction
      const touch = e.touches[0];
      const startY = (container as HTMLDivElement & { _startY?: number })._startY || touch.clientY;
      const deltaY = touch.clientY - startY;
      const isScrollingUp = deltaY > 0;
      const isScrollingDown = deltaY < 0;

      // Prevent scroll propagation at boundaries
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
      }
      
      // Stop propagation to prevent parent scroll
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
  }, [isMobile, isExpanded]);

  // Desktop/tablet layout - full content visible
  if (!isMobile) {
    return (
      <div
        className="relative overflow-hidden ios-radius-fix rounded-[12px] sm:rounded-[16px] lg:rounded-[24px] border-[4px] sm:border-[8px] lg:border-[12px] border-[#9ac1bf] w-full h-full"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={pathway.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.1)' }}
          />
        </div>

        {/* Content Card - anchored bottom-left, fills height with flex col */}
        <div
          className="absolute bottom-0 left-0 flex flex-col rounded-[8px] sm:rounded-[12px] lg:rounded-[20px] bg-[rgba(53,68,67,0.8)] backdrop-blur-[4px] m-2 sm:m-4 lg:m-6 w-full sm:w-[70%] lg:w-[75%]"
          style={{
            maxHeight: 'calc(100% - 3rem)',
          }}
        >
          {/* Content area */}
          <div
            className="flex-1 min-h-0 p-3 sm:p-4 lg:p-5"
          >
            {/* Title */}
            <h3
              className="mb-2 lg:mb-3 text-[clamp(1.5rem,4vw,3rem)] leading-[1.0] text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              {pathway.title}
            </h3>

            {/* Subtitle */}
            <p
              data-element="subtitle"
              className="mb-2 lg:mb-3 text-[clamp(0.875rem,2vw,1.5rem)] leading-[1.2] text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {pathway.subtitle}
            </p>

            {/* Description */}
            <div
              className="mb-2 lg:mb-3 text-justify text-[clamp(0.75rem,1.5vw,1rem)] leading-relaxed text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              {pathway.description.map((para, idx) => (
                <p key={idx} className={idx < pathway.description.length - 1 ? 'mb-2 lg:mb-3' : ''}>
                  {para}
                </p>
              ))}
            </div>

            {/* What to Expect */}
            <div
              className="text-[clamp(0.75rem,1.5vw,1rem)] leading-relaxed text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
            >
              <p className="mb-1 font-medium">What to Expect:</p>
              <ul className="list-inside list-disc space-y-0.5">
                {pathway.whatToExpect.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA — always pinned at the bottom */}
          <div className="shrink-0 px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5 pt-2">
            {onCtaClick ? (
              <Button
                text={pathway.ctaText}
                onClick={onCtaClick}
                mode="dark"
                size="medium"
                colors={pathwaysButtonColors}
              />
            ) : (
              <Button
                text={pathway.ctaText}
                href={pathway.ctaHref}
                mode="dark"
                size="medium"
                colors={pathwaysButtonColors}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout - collapsed/expanded states
  return (
    <div
      className="relative flex flex-col overflow-hidden ios-radius-fix rounded-[24px] border-[16px] border-[#9ac1bf] w-full h-full"
    >
      {/* Background Image - fills entire card, cropping is fine */}
      <div className="absolute inset-0 -z-10">
        <img
          src={pathway.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Card - Mobile version - Full width, no side/bottom padding */}
      <div
        ref={contentRef}
        className={`
          flex flex-col backdrop-blur-[4px] bg-[rgba(53,68,67,0.8)] rounded-t-[8px] p-5
          transition-all duration-300 ease-out
          ${isExpanded ? 'flex-1 min-h-0 rounded-b-[8px]' : 'mt-auto rounded-b-none'}
        `}
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          marginTop: isExpanded ? 0 : 'auto',
        }}
      >
        {/* Collapsed State */}
        {!isExpanded && (
          <>
            {/* Title */}
            <h3
              className="mb-4 text-[36px] leading-[1.0] text-[#9ac1bf] text-left"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              {pathway.title}
            </h3>
            
            {/* Subtitle */}
            <p
              className="mb-4 text-[16px] leading-[24px] text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {pathway.subtitle}
            </p>
            
            {/* Read More Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={handleExpand}
                className="flex items-center justify-center gap-2 p-3 text-[#9ac1bf] hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="w-7 h-5" />
                <span
                  className="text-[18px] tracking-[2.88px] uppercase px-2 py-2"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  Read more
                </span>
                <ArrowRight className="w-7 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <div className="flex flex-col h-full min-h-0">
            {/* Header with Title and Close Button */}
            <div className="flex items-start justify-between mb-4 shrink-0">
              <h3
                className="text-[24px] leading-[1.0] text-[#9ac1bf]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {pathway.title}
              </h3>
              <button
                onClick={handleClose}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#9ac1bf] hover:opacity-70 transition-opacity ml-4"
                aria-label="Close details"
              >
                <img
                  src="/Icon - Close.svg"
                  alt="Close"
                  className="h-6 w-6"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(77%) sepia(8%) saturate(900%) hue-rotate(127deg) brightness(93%) contrast(88%)',
                  }}
                />
              </button>
            </div>

            {/* Subtitle */}
            <p
              className="mb-4 text-[16px] leading-[24px] text-[#9ac1bf] shrink-0"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {pathway.subtitle}
            </p>

            {/* Scrollable Content Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto min-h-0 overscroll-contain no-scrollbar"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Description */}
              <div 
                className="mb-4 text-justify text-[16px] leading-[24px] text-[#9ac1bf]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {pathway.description.map((para, idx) => (
                  <p key={idx} className={idx < pathway.description.length - 1 ? 'mb-4' : ''}>
                    {para}
                  </p>
                ))}
              </div>
              
              {/* What to Expect */}
              <div 
                className="mb-4 text-[16px] leading-[24px] text-[#9ac1bf]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
              >
                <p className="mb-2 font-medium">What to Expect:</p>
                <ul className="list-inside list-disc space-y-1">
                  {pathway.whatToExpect.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* CTA Button at bottom - 2 line text for mobile */}
              <div className="flex justify-center w-full pt-2">
                <MobileCtaButton
                  text={pathway.ctaText}
                  href={onCtaClick ? undefined : pathway.ctaHref}
                  onClick={onCtaClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
