'use client';

import { useThoughts, type SanityThought } from '@/sanity/lib/queries';
import Image from 'next/image';

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
// Thought Card Component
// =============================================================================

interface ThoughtCardProps {
  thought: SanityThought;
  isLarge?: boolean;
}

function ThoughtCard({ thought, isLarge = false }: ThoughtCardProps) {
  const { content, imageUrl } = thought;
  const hasImage = !!imageUrl;
  
  // Determine if content is long (for varying card heights when no image)
  const isLongContent = content.length > 150;
  
  return (
    <div
      className={`
        flex flex-col overflow-hidden
        rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] 
        bg-[#9ac1bf]
        ${isLarge 
          ? 'lg:row-span-2' 
          : ''
        }
        ${!hasImage && !isLarge
          ? isLongContent 
            ? 'min-h-[220px] sm:min-h-[260px]' 
            : 'min-h-[180px] sm:min-h-[200px]'
          : ''
        }
      `}
    >
      {/* Image (if available) */}
      {hasImage && (
        <div className={`relative w-full ${isLarge ? 'h-[200px] lg:h-[280px]' : 'h-[160px] sm:h-[180px]'}`}>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div className={`
        flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-10
        ${hasImage ? '' : 'min-h-[180px] sm:min-h-[200px]'}
        ${isLarge && hasImage ? 'lg:min-h-[136px]' : ''}
      `}>
        <p
          className="text-center text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#354443]"
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
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
      <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
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
      <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
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
  
  // Render thought cards in a masonry-like grid
  return (
    <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
      {/* Title */}
      <h2
        className="text-center text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#354443]"
        style={{ fontFamily: 'var(--font-saphira), serif' }}
      >
        Thoughts & Ponderings
      </h2>

      {/* Grid of thought cards */}
      <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {thoughts.map((thought, index) => {
          // Make every 3rd card (starting from index 2) span 2 rows on desktop
          // This creates a nice masonry-like effect
          const isLargeCard = index % 5 === 2; // Position 3, 8, 13, etc.
          
          return (
            <ThoughtCard
              key={thought._id}
              thought={thought}
              isLarge={isLargeCard}
            />
          );
        })}
      </div>
    </div>
  );
}
