'use client';

import Section from './Section';
import { useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTestimonials, type SanityTestimonial } from '@/sanity/lib/queries';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =============================================================================
// Loading Spinner Component
// =============================================================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#474e3a]/20" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-t-[#474e3a] animate-spin" />
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
      <div className="mb-4 text-[#474e3a]/60">
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
        className="text-[16px] text-[#474e3a]/80 mb-4"
        style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-[14px] text-[#474e3a] border border-[#474e3a] rounded-full hover:bg-[#474e3a] hover:text-[#f6edd0] transition-colors"
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
        className="text-[18px] text-[#474e3a]/60"
        style={{ fontFamily: 'var(--font-saphira), serif' }}
      >
        No testimonials to show at the moment.
      </p>
      <p
        className="mt-2 text-[14px] text-[#474e3a]/50"
        style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
      >
        Check back soon for voices of transformation.
      </p>
    </div>
  );
}

// Fallback testimonials in case Sanity fails or returns empty (for better UX)
const fallbackTestimonials: SanityTestimonial[] = [
  {
    _id: 'fallback-1',
    testimonial: `Namita's healing sessions have truly transformed how I feel — lighter, calmer, and genuinely happier. I'm deeply thankful for her guidance and energy. Since I started going to her, something within me has shifted; my entire mindset feels more open and at peace. Her work has been such a beautiful influence in my life.`,
    name: 'ROMA PRIYA',
    workshop: 'Access Energetic Facelift/ SOP',
    publishedAt: '2024-01-01',
  },
  {
    _id: 'fallback-2',
    testimonial: `What has unfolded since I met Namita has been a journey far beyond what I could have imagined. What sets Namita apart is the way she holds 'space' with love, clarity, and quiet strength allowing one's own awakening to unfold. She has helped me see the interconnectedness of all life, how every part of nature lives within us, and we within it. She embodies the spirit of a real shaman: compassionate, wise, and rooted in love.`,
    name: 'UMPILIKA',
    workshop: 'Foot Reflexology/ Shamanic Student/ Distance Healing/ Antar Smaran Process/ Systemic Constellations',
    publishedAt: '2024-01-02',
  },
  {
    _id: 'fallback-3',
    testimonial: `Namita has helped me breathe—literally and figuratively. I first consulted her for a tennis elbow, which she sorted out for me, very quickly and permanently. Thereafter, a severe issue with suffocation was resolved. Over the years, she has helped me change from a barren, harsh landscape, unforgiving to myself to a greener, more open, self-nurturing space. Namita's intuitive skills, combined with her humour and compassion and practicality that weave a warm, comforting space for healing the mind, body and soul. Mine, for sure.`,
    name: 'RACHNA TIWARI',
    workshop: 'Foot Reflexology/ Access Bars/ Systemic Constellations',
    publishedAt: '2024-01-03',
  },
];

export default function VoicesOfTransformation() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Fetch testimonials from Sanity CMS
  const { testimonials: sanityTestimonials, isLoading, error, refetch } = useTestimonials();
  
  // Use Sanity testimonials if available, otherwise fall back to hardcoded ones
  // This ensures the carousel always has content to display
  const testimonials = useMemo(() => {
    if (sanityTestimonials.length > 0) {
      return sanityTestimonials;
    }
    // If no Sanity data and no error, show nothing (still loading)
    // If error or empty after loading, use fallback
    if (!isLoading) {
      return fallbackTestimonials;
    }
    return [];
  }, [sanityTestimonials, isLoading]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only set ready when we have testimonials to display
    if (testimonials.length === 0) return;
    
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(readyTimeout);
    };
  }, [testimonials.length]);

  // Setup horizontal scroll animation with snap to each card
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;
    if (testimonials.length === 0) return;

    const container = containerRef.current;
    const carousel = carouselRef.current;
    if (!container || !carousel) return;

    // Wait for layout to settle
    const setupTimeout = setTimeout(() => {
      const cards = carousel.querySelectorAll('.voice-card');
      const cardCount = cards.length;
      
      if (cardCount === 0) return;
      
      // Calculate total horizontal scroll distance
      const scrollWidth = carousel.scrollWidth - window.innerWidth + 100;

      // Create timeline for horizontal scroll
      const tl = gsap.timeline();
      
      tl.to(carousel, {
        x: -scrollWidth,
        ease: 'none',
      });

      // Create snap points for each card (equally distributed)
      const snapPoints = Array.from({ length: cardCount }, (_, i) => i / (cardCount - 1));

      // Get header height for proper positioning
      const headerHeight = window.innerWidth >= 1024 ? 148 : window.innerWidth >= 640 ? 108 : 90;
      
      // Create horizontal scroll animation with snap
      const st = ScrollTrigger.create({
        id: 'VOICES-CAROUSEL',
        trigger: container,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        animation: tl,
        // Start pinning when section top reaches just below the header
        start: `top top+=${headerHeight}`,
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.2, max: 0.4 },
          delay: 0.1,
          ease: 'power2.inOut',
        },
      });

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();

      return () => {
        st.kill();
        tl.kill();
      };
    }, 300);

    return () => {
      clearTimeout(setupTimeout);
      // Clean up ScrollTriggers for this component
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.id === 'VOICES-CAROUSEL') {
          st.kill();
        }
      });
    };
  }, [isReady, testimonials.length]);

  // Show loading state while fetching
  if (isLoading && testimonials.length === 0) {
    return (
      <Section
        id="voices"
        className="relative w-full bg-[#f6edd0]"
        ref={sectionRef}
      >
        <div 
          className="relative w-full flex flex-col justify-center items-center overflow-hidden bg-[#f6edd0]"
          style={{ 
            minHeight: 'calc(100vh - var(--header-height, 90px))',
            height: 'calc(100vh - var(--header-height, 90px))',
          }}
        >
          <div className="w-full text-center mb-6 sm:mb-8 lg:mb-10 px-4 pt-8 sm:pt-12 lg:pt-16">
            <h2
              className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Voices of Transformation
            </h2>
          </div>
          <LoadingSpinner />
        </div>
      </Section>
    );
  }

  // Show error state if fetch failed and no fallback
  if (error && testimonials.length === 0) {
    return (
      <Section
        id="voices"
        className="relative w-full bg-[#f6edd0]"
        ref={sectionRef}
      >
        <div 
          className="relative w-full flex flex-col justify-center items-center overflow-hidden bg-[#f6edd0]"
          style={{ 
            minHeight: 'calc(100vh - var(--header-height, 90px))',
            height: 'calc(100vh - var(--header-height, 90px))',
          }}
        >
          <div className="w-full text-center mb-6 sm:mb-8 lg:mb-10 px-4 pt-8 sm:pt-12 lg:pt-16">
            <h2
              className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Voices of Transformation
            </h2>
          </div>
          <ErrorState 
            message="Unable to load testimonials. Please try again." 
            onRetry={refetch} 
          />
        </div>
      </Section>
    );
  }

  // Show empty state if no testimonials
  if (testimonials.length === 0) {
    return (
      <Section
        id="voices"
        className="relative w-full bg-[#f6edd0]"
        ref={sectionRef}
      >
        <div 
          className="relative w-full flex flex-col justify-center items-center overflow-hidden bg-[#f6edd0]"
          style={{ 
            minHeight: 'calc(100vh - var(--header-height, 90px))',
            height: 'calc(100vh - var(--header-height, 90px))',
          }}
        >
          <div className="w-full text-center mb-6 sm:mb-8 lg:mb-10 px-4 pt-8 sm:pt-12 lg:pt-16">
            <h2
              className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Voices of Transformation
            </h2>
          </div>
          <EmptyState />
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="voices"
      className="relative w-full bg-[#f6edd0]"
      ref={sectionRef}
    >
      {/* Carousel Container - This gets pinned (height accounts for header) */}
      <div 
        ref={containerRef}
        className="relative w-full flex flex-col justify-center overflow-hidden bg-[#f6edd0]"
        style={{ 
          minHeight: 'calc(100vh - var(--header-height, 90px))',
          height: 'calc(100vh - var(--header-height, 90px))',
        }}
      >
        {/* Section Title */}
        <div className="w-full text-center mb-6 sm:mb-8 lg:mb-10 px-4 pt-8 sm:pt-12 lg:pt-16">
          <h2
            className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Voices of Transformation
          </h2>
        </div>

        {/* Carousel Track */}
        <div className="flex-1 flex items-center w-full px-4 sm:px-6 lg:px-10">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 will-change-transform"
          >
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="voice-card shrink-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#474e3a] p-5 sm:p-8 lg:p-10 flex flex-col justify-center w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] lg:w-[calc(100vw-80px)] h-[clamp(350px,50vh,500px)]"
              >
                <p
                  className="text-justify text-[14px] sm:text-[18px] lg:text-[22px] leading-[1.5] sm:leading-[1.6] text-[#f6edd0]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  {t.testimonial}
                </p>
                <div className="pt-4 sm:pt-6 lg:pt-8 text-center text-[#f6edd0]">
                  <p
                    className="text-[18px] sm:text-[20px] lg:text-[22px] leading-[normal]"
                    style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[1.5px] sm:tracking-[1.7px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    {t.workshop}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div className="pb-8 sm:pb-12 lg:pb-16" />
      </div>
    </Section>
  );
}
