'use client';

import { useThoughts, type SanityThought } from '@/sanity/lib/queries';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';

// =============================================================================
// Constants
// =============================================================================

// Grid configuration: 4 columns x 2 rows = 8 cards max before horizontal scroll
const GRID_COLUMNS = 4;
const GRID_ROWS = 2;
const MAX_CARDS_IN_VIEW = GRID_COLUMNS * GRID_ROWS;

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

// =============================================================================
// Loading Spinner Component
// =============================================================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-2 border-[#354443]/20" />
        {/* Spinning arc */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-t-[#354443] animate-spin" />
      </div>
    </div>
  );
}

// =============================================================================
// Error State Component
// =============================================================================

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-[#354443]/60">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p
        className="text-[16px] text-[#354443]/80 mb-4"
        style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-[14px] text-[#354443] border border-[#354443] rounded-full hover:bg-[#354443] hover:text-[#f6edd0] transition-colors"
          style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Empty State Component
// =============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p
        className="text-[18px] text-[#354443]/60"
        style={{ fontFamily: 'var(--font-saphira), serif' }}
      >
        No thoughts to share at the moment.
      </p>
      <p
        className="mt-2 text-[14px] text-[#354443]/50"
        style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
      >
        Check back soon for new reflections.
      </p>
    </div>
  );
}

// =============================================================================
// Thought Card Component (Desktop Grid)
// =============================================================================

interface ThoughtCardProps {
  thought: SanityThought;
}

function ThoughtCard({ thought }: ThoughtCardProps) {
  const { content, imageUrl } = thought;
  const hasImage = !!imageUrl;
  
  // Dynamic text size based on content length
  const getTextSize = () => {
    if (content.length < 50) {
      return 'text-[20px] sm:text-[22px] lg:text-[26px]';
    }
    if (content.length < 100) {
      return 'text-[18px] sm:text-[20px] lg:text-[22px]';
    }
    if (content.length < 200) {
      return 'text-[16px] sm:text-[18px] lg:text-[20px]';
    }
    return 'text-[14px] sm:text-[16px] lg:text-[18px]';
  };
  
  return (
    <div
      className="
        flex flex-col overflow-hidden
        h-full
        rounded-[16px] sm:rounded-[20px] lg:rounded-[24px]
        bg-[#9ac1bf]
      "
    >
      {/* Image (if available) - takes up to 45% of card, shrinks to fit */}
      {hasImage && (
        <div className="relative w-full shrink-0 overflow-hidden" style={{ height: '40%', minHeight: '80px' }}>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content - fills remaining space, no truncation */}
      <div
        className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-5 overflow-hidden"
      >
        <p
          className={`text-center ${getTextSize()} leading-snug text-[#354443]`}
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Mobile Thought Card Component (for vertical scroll view)
// =============================================================================

interface MobileThoughtCardProps {
  thought: SanityThought;
}

function MobileThoughtCard({ thought }: MobileThoughtCardProps) {
  const { content, imageUrl } = thought;
  const hasImage = !!imageUrl;
  
  // Dynamic text size for mobile
  const getTextSize = () => {
    if (content.length < 50) {
      return 'text-[20px]';
    }
    if (content.length < 100) {
      return 'text-[18px]';
    }
    if (content.length < 200) {
      return 'text-[16px]';
    }
    return 'text-[15px]';
  };
  
  return (
    <div
      className="
        flex flex-col overflow-hidden shrink-0
        rounded-[16px]
        bg-[#9ac1bf]
      "
    >
      {/* Image (if available) */}
      {hasImage && (
        <div className="relative w-full aspect-[4/3] max-h-[200px] overflow-hidden">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex items-center justify-center p-5">
        <p
          className={`text-center ${getTextSize()} leading-relaxed text-[#354443]`}
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function ThoughtsAndPonderings() {
  const { thoughts, isLoading, error, refetch } = useThoughts();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Determine if we need horizontal scroll on desktop (more cards than fit in 4x2 grid)
  const needsHorizontalScroll = useMemo(() => {
    return thoughts.length > MAX_CARDS_IN_VIEW;
  }, [thoughts.length]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <h2
          className="text-center text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#354443]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Thoughts & Ponderings
        </h2>
        <LoadingSpinner />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <h2
          className="text-center text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#354443]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Thoughts & Ponderings
        </h2>
        <ErrorState message="Unable to load thoughts. Please try again." onRetry={refetch} />
      </div>
    );
  }
  
  // Empty state
  if (thoughts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <h2
          className="text-center text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#354443]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Thoughts & Ponderings
        </h2>
        <EmptyState />
      </div>
    );
  }
  
  // ==========================================================================
  // MOBILE VIEW: Vertically scrollable stacked cards
  // ==========================================================================
  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col gap-4">
        {/* Title */}
        <h2
          className="text-center text-[32px] leading-[1.0] text-[#354443] shrink-0 px-4"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Thoughts & Ponderings
        </h2>
        
        {/* Scrollable card container - native scroll with containment */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 min-h-0 scrollbar-hide"
          style={{ 
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex flex-col gap-4">
            {thoughts.map((thought) => (
              <MobileThoughtCard
                key={thought._id}
                thought={thought}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // ==========================================================================
  // DESKTOP VIEW: CSS Grid layout
  // ==========================================================================
  
  // Card layout calculations
  const cardCount = thoughts.length;
  
  // Number of columns: for <=4 cards use 1 row, 5-6 use 3 cols, 7-8 use 4 cols
  const colCount = cardCount <= 4 ? cardCount : (cardCount <= 6 ? 3 : 4);
  // Single row for <=4 cards, two rows otherwise
  const isSingleRow = cardCount <= 4;
  
  return (
    <div className="w-full h-full flex flex-col gap-6 sm:gap-8">
      {/* Title - fixed height */}
      <h2
        className="text-center text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#354443] shrink-0"
        style={{ fontFamily: 'var(--font-saphira), serif' }}
      >
        Thoughts & Ponderings
      </h2>

      {/* Grid Container - fills remaining height, centered */}
      <div
        className={`
          flex-1 min-h-0 flex items-center justify-center
          ${needsHorizontalScroll ? 'overflow-x-auto overflow-y-hidden pb-2' : ''}
        `}
      >
        {/* CSS Grid Layout */}
        <div
          className={`
            grid gap-4 sm:gap-5 lg:gap-6
            ${needsHorizontalScroll 
              ? 'grid-flow-col auto-cols-[minmax(280px,320px)] grid-rows-2 h-full' 
              : `${isSingleRow ? 'grid-rows-1' : 'grid-rows-2'} justify-items-center`
            }
          `}
          style={{
            ...(needsHorizontalScroll ? { width: 'max-content' } : {
              gridTemplateColumns: `repeat(${colCount}, 1fr)`,
              maxWidth: `${colCount * 320}px`,
              width: '100%',
              height: isSingleRow ? '55%' : '100%',
              maxHeight: isSingleRow ? '420px' : undefined,
            }),
          }}
        >
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought._id}
              thought={thought}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
