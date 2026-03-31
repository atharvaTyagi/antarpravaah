'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

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

function SidePillLeft({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M3.95403 6.84653C0.187192 8.1341 -1.7 0.921172 2.00456 0.0757431C5.65533 -0.757083 7.82278 5.5243 3.95403 6.84653Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SidePillRight({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="7"
      viewBox="0 0 6 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M2.04597 6.84653C5.81281 8.1341 7.7 0.921172 3.99544 0.0757431C0.344669 -0.757083 -1.82278 5.5243 2.04597 6.84653Z"
        fill="currentColor"
      />
    </svg>
  );
}

// CTA Button with optional 2-line text layout for mobile
function CtaButton({ text, onClick, singleLine = false }: { text: string; onClick?: () => void; singleLine?: boolean }) {
  const getTextLines = (fullText: string): string[] => {
    if (singleLine) return [fullText];
    const words = fullText.split(' ');
    if (words.length <= 2) {
      return [fullText];
    }
    // Split roughly in half for 2 lines
    const midpoint = Math.ceil(words.length / 2);
    return [
      words.slice(0, midpoint).join(' '),
      words.slice(midpoint).join(' ')
    ];
  };

  const lines = getTextLines(text);

  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-2 p-3 text-[#6a3f33]"
      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
    >
      {/* Left slot: arrow ↔ pill (animated) */}
      <span className="w-7 h-5 relative shrink-0">
        <ArrowLeft className="w-7 h-5 absolute inset-0 m-auto transition-all duration-200 ease-out group-hover:opacity-0 group-hover:-translate-x-1 group-hover:scale-90" />
        <SidePillLeft className="w-[6px] h-[7px] absolute inset-0 m-auto opacity-0 translate-x-1 scale-90 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 text-[#6a3f33]" />
      </span>
      <span className={`text-center text-[18px] tracking-[2.88px] uppercase leading-tight px-3 py-1.5 rounded-lg transition-colors duration-150 group-hover:bg-[#6a3f33] group-hover:text-[#d58761] ${singleLine ? 'whitespace-nowrap' : ''}`}>
        {lines.map((line, idx) => (
          <span key={idx} className="block">{line}</span>
        ))}
      </span>
      {/* Right slot: arrow ↔ pill (animated) */}
      <span className="w-7 h-5 relative shrink-0">
        <ArrowRight className="w-7 h-5 absolute inset-0 m-auto transition-all duration-200 ease-out group-hover:opacity-0 group-hover:translate-x-1 group-hover:scale-90" />
        <SidePillRight className="w-[6px] h-[7px] absolute inset-0 m-auto opacity-0 -translate-x-1 scale-90 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 text-[#6a3f33]" />
      </span>
    </button>
  );
}

export interface ImmersionData {
  _id?: string;           // Sanity document ID
  id?: string;            // Legacy ID for backwards compatibility
  title: string;
  slug?: string;          // URL slug from Sanity
  type: 'immersion' | 'workshop';
  duration: string;
  language: string;
  prerequisite: string;
  format: string;
  about: string;
  whatToExpect: string[];
  image?: string;         // Cloudinary URL (legacy)
  imageUrl?: string;      // Sanity image URL
  ctaText: string;
  order?: number;
}

export interface TrainingData {
  _id?: string;           // Sanity document ID
  id?: string;            // Legacy ID for backwards compatibility
  title: string;
  slug?: string;          // URL slug from Sanity
  duration: string;
  prerequisites: string;
  format: string;
  language: string;
  overview: string;
  whatYoullLearn: string[];
  ctaText: string;
  order?: number;
}

interface ImmersionCardProps {
  data: ImmersionData;
  isMobile?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onBookingClick?: () => void;
}

interface TrainingCardProps {
  data: TrainingData;
  isMobile?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onBookingClick?: () => void;
}

// Immersion/Workshop Card Component
export function ImmersionCard({ data, isMobile = false, onExpandedChange, onBookingClick }: ImmersionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      const touch = e.touches[0];
      const startY = (container as HTMLDivElement & { _startY?: number })._startY || touch.clientY;
      const deltaY = touch.clientY - startY;
      const isScrollingUp = deltaY > 0;
      const isScrollingDown = deltaY < 0;

      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
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
  }, [isMobile, isExpanded]);

  // Desktop / tablet: two columns — left: title, pill, meta, image; right: About, What To Expect, CTA
  if (!isMobile) {
    return (
      <div className="flex h-full max-h-full min-h-0 w-full min-w-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-3 sm:p-4 gap-3 md:gap-4 lg:gap-5">
        {/* Left column: title, pill, meta, image */}
        <div className="flex min-h-0 min-w-0 shrink-0 flex-col gap-3 md:w-[46%] lg:w-[44%]">
          {/* Info box */}
          <div className="flex flex-col gap-3 rounded-lg border border-[#6a3f33] p-3">
            <div className="flex flex-col gap-2">
              <h4
                className="text-[22px] sm:text-[26px] lg:text-[32px] leading-tight text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {data.title}
              </h4>
              <span
                className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                {data.type === 'immersion' ? 'Immersion' : 'Workshop'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Duration
                </p>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.duration}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Language
                </p>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.language}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Prerequisite
                </p>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.prerequisite}
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Format
                </p>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.format}
                </p>
              </div>
            </div>
          </div>

          {/* Image fills remaining left-column space */}
          {(data.imageUrl || data.image) && (
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
              <Image
                src={data.imageUrl || data.image || ''}
                alt={data.title}
                fill
                sizes="(max-width: 900px) 46vw, (max-width: 1200px) 40vw, 32vw"
                quality={85}
                loading="lazy"
                className="object-cover object-center"
              />
            </div>
          )}
        </div>

        {/* Right column: About, What To Expect, CTA */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                About
              </p>
              <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.about}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                What To Expect
              </p>
              <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.whatToExpect.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <CtaButton text={data.ctaText} onClick={onBookingClick} singleLine />
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout - collapsed/expanded states
  return (
    <div className="bg-[#d58761] flex flex-col h-full max-h-[560px] rounded-[24px] p-5 w-full">
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Info box */}
          <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4 flex-1">
            <div className="flex flex-col gap-2">
              <h4
                className="text-[36px] leading-[1.0] text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {data.title}
              </h4>
              <span
                className="flex items-center justify-start rounded-full bg-[#6a3f33] px-2 py-0.5 text-[12px] text-[#d58761]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                {data.type === 'immersion' ? 'Immersion' : 'Workshop'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Duration
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.duration}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Language
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.language}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Prerequisite
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.prerequisite}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Format
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.format}
                </p>
              </div>
            </div>
          </div>

          {/* Read More CTA */}
          <div className="flex justify-center shrink-0 mt-4">
            <CtaButton text="Read More" onClick={handleExpand} />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="flex h-full min-h-0 flex-col">
          {/* Header with Title and Close Button */}
          <div className="mb-4 flex shrink-0 flex-col gap-2">
            <div className="flex items-start justify-between">
              <h4
                className="flex-1 text-[24px] leading-[1.0] text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {data.title}
              </h4>
              <button
                onClick={handleClose}
                className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#6a3f33] transition-opacity hover:opacity-70"
                aria-label="Close details"
              >
                <img
                  src="/Icon - Close.svg"
                  alt="Close"
                  className="h-6 w-6"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(24%) sepia(15%) saturate(1476%) hue-rotate(336deg) brightness(96%) contrast(87%)',
                  }}
                />
              </button>
            </div>
            <span
              className="flex items-center justify-start rounded-full bg-[#6a3f33] px-2 py-0.5 text-[12px] text-[#d58761]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {data.type === 'immersion' ? 'Immersion' : 'Workshop'}
            </span>
          </div>

          {/* Scrollable body — CTA stays pinned below */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="mb-4 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <p className="mb-1 text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                About
              </p>
              <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.about}
              </p>
            </div>

            {(data.imageUrl || data.image) && (
              <div className="relative mb-4 aspect-[5/3] w-full shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={data.imageUrl || data.image || ''}
                  alt={data.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  quality={85}
                  loading="lazy"
                  className="object-contain object-left object-bottom"
                />
              </div>
            )}

            <div className="mb-2 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <p className="mb-1 text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                What To Expect
              </p>
              <ul className="ml-6 list-disc text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.whatToExpect.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex w-full shrink-0 justify-center border-t border-[#6a3f33]/20 pt-3">
            <CtaButton text={data.ctaText} onClick={onBookingClick} />
          </div>
        </div>
      )}
    </div>
  );
}

// Training Card Component
export function TrainingCard({ data, isMobile = false, onExpandedChange, onBookingClick }: TrainingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      const touch = e.touches[0];
      const startY = (container as HTMLDivElement & { _startY?: number })._startY || touch.clientY;
      const deltaY = touch.clientY - startY;
      const isScrollingUp = deltaY > 0;
      const isScrollingDown = deltaY < 0;

      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
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
  }, [isMobile, isExpanded]);

  // Desktop / tablet — match immersion card: scrollable body, pinned CTA, full width of carousel slot
  if (!isMobile) {
    return (
      <div className="flex h-full max-h-full min-h-0 w-full min-w-0 flex-col rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5 lg:p-6">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4">
              <h4
                className="text-[24px] sm:text-[28px] lg:text-[32px] leading-tight text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {data.title}
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[#6a3f33] sm:gap-x-8" style={{ lineHeight: '20px' }}>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>{data.duration}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisites</p>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>{data.prerequisites}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>{data.format}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>{data.language}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
              <div className="flex flex-col gap-1.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Overview</p>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  {data.overview}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What You&apos;ll Learn</p>
                <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  {data.whatYoullLearn.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-center">
          <CtaButton text={data.ctaText} onClick={onBookingClick} singleLine />
        </div>
      </div>
    );
  }

  // Mobile layout - collapsed/expanded states
  return (
    <div className="bg-[#d58761] flex flex-col h-full max-h-[625px] rounded-[24px] p-5 w-full">
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Info box */}
          <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4 mb-4 flex-1">
            <h4
              className="text-[36px] leading-[1.0] text-[#6a3f33]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              {data.title}
            </h4>

            <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Duration
                </p>
                <p className="text-[16px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.duration}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Prerequisites
                </p>
                <p className="text-[16px] whitespace-pre-line" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.prerequisites}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Format
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.format}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                  Language
                </p>
                <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                  {data.language}
                </p>
              </div>
            </div>
          </div>

          {/* Read More CTA */}
          <div className="flex justify-center shrink-0">
            <CtaButton text="Read More" onClick={handleExpand} />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-4 flex shrink-0 items-start justify-between">
            <h4
              className="flex-1 text-[24px] leading-[1.0] text-[#6a3f33]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              {data.title}
            </h4>
            <button
              onClick={handleClose}
              className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center text-[#6a3f33] transition-opacity hover:opacity-70"
              aria-label="Close details"
            >
              <img
                src="/Icon - Close.svg"
                alt="Close"
                className="h-6 w-6"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(24%) sepia(15%) saturate(1476%) hue-rotate(336deg) brightness(96%) contrast(87%)',
                }}
              />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="mb-4 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <p className="mb-1 text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                Overview
              </p>
              <p className="text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.overview}
              </p>
            </div>

            <div className="mb-2 text-[#6a3f33]" style={{ lineHeight: '24px' }}>
              <p className="mb-1 text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                What You&apos;ll Learn
              </p>
              <ul className="ml-6 list-disc text-[16px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                {data.whatYoullLearn.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex w-full shrink-0 justify-center border-t border-[#6a3f33]/20 pt-3">
            <CtaButton text={data.ctaText} onClick={onBookingClick} />
          </div>
        </div>
      )}
    </div>
  );
}
