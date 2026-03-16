'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

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

// CTA Button for mobile modality cards
function ModalityCtaButton({
  text,
  onClick,
  fullWidth = false,
}: {
  text: string;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 p-3 text-[#645c42] hover:opacity-80 transition-opacity ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
    >
      <ArrowLeft className="w-5 h-4 shrink-0" />
      <span className="text-center text-[16px] tracking-[2px] uppercase leading-tight">
        {text}
      </span>
      <ArrowRight className="w-5 h-4 shrink-0" />
    </button>
  );
}

export interface MobileModalityData {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  bestFor: {
    column1: string[];
    column2: string[];
  };
  sessionDuration: string;
  ctaText: string;
  iconSrc: string;
}

interface MobileModalityCardProps {
  data: MobileModalityData;
  onExpandedChange?: (expanded: boolean) => void;
  onCtaClick?: () => void;
}

export default function MobileModalityCard({
  data,
  onExpandedChange,
  onCtaClick,
}: MobileModalityCardProps) {
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
    if (!isExpanded || !scrollContainerRef.current) return;

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
  }, [isExpanded]);

  // Collapsed State - Default view with icon, title, subtitle, Read More
  if (!isExpanded) {
    return (
      <div className="bg-[#d6c68e] flex flex-col h-full w-[80vw] max-w-[340px] rounded-[24px] overflow-hidden ios-radius-fix p-6">
        {/* Icon at top - takes flex-1 */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img
            src={data.iconSrc}
            alt={data.title}
            className="w-[70%] h-auto max-h-[40vh] object-contain"
          />
        </div>

        {/* Title */}
        <h3
          className="text-[28px] leading-[1.0] text-[#645c42] text-center shrink-0"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {data.title}
        </h3>

        {/* Subtitle */}
        <p
          className="text-[14px] leading-[1.5] text-[#645c42] text-center mt-2 shrink-0"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
        >
          {data.subtitle}
        </p>

        {/* Read More Button */}
        <div className="mt-3 w-full shrink-0">
          <ModalityCtaButton text="Read More" onClick={handleExpand} fullWidth />
        </div>
      </div>
    );
  }

  // Expanded State - Title + Close + scrollable content
  return (
    <div className="bg-[#d6c68e] flex flex-col h-full w-[80vw] max-w-[340px] rounded-[24px] overflow-hidden ios-radius-fix p-6">
      {/* Header with Title and Close Button */}
      <div className="flex items-start justify-between mb-4 shrink-0">
        <h3
          className="text-[36px] leading-[1.0] text-[#645c42] flex-1"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {data.title}
        </h3>
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#645c42] hover:opacity-70 transition-opacity ml-4"
          aria-label="Close details"
        >
          <img
            src="/Icon - Close.svg"
            alt="Close"
            className="h-6 w-6"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(35%) sepia(8%) saturate(1467%) hue-rotate(12deg) brightness(95%) contrast(87%)',
            }}
          />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0 overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Subtitle */}
        <p
          className="text-[16px] leading-[24px] text-[#645c42] mb-4"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
        >
          {data.subtitle}
        </p>

        {/* Description */}
        <div
          className="text-[16px] leading-[24px] text-[#645c42] text-justify mb-4"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
        >
          {data.description.map((para, idx) => (
            <p key={idx} className={idx < data.description.length - 1 ? 'mb-3' : ''}>
              {para}
            </p>
          ))}
        </div>

        {/* Best For Section */}
        {(data.bestFor.column1.length > 0 || data.bestFor.column2.length > 0) && (
          <div className="mb-4">
            <p
              className="text-[16px] leading-[24px] text-[#645c42] mb-2"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              Best For
            </p>
            <ul
              className="list-disc list-inside text-[14px] leading-[22px] text-[#645c42]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              {[...data.bestFor.column1, ...data.bestFor.column2].map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Session Duration */}
        <div className="mb-4">
          <p
            className="text-[16px] leading-[24px] text-[#645c42]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
          >
            Session Duration
          </p>
          <p
            className="text-[14px] leading-[22px] text-[#645c42]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            {data.sessionDuration}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <ModalityCtaButton text={data.ctaText} fullWidth onClick={onCtaClick} />
        </div>
      </div>
    </div>
  );
}
