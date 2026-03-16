'use client';

import { useLayoutEffect, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import { useTestimonials, type SanityTestimonial } from '@/sanity/lib/queries';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

interface VoicesOfTransformationProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

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

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-[#474e3a]/60">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    workshop:
      'Foot Reflexology/ Shamanic Student/ Distance Healing/ Antar Smaran Process/ Systemic Constellations',
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

export default function VoicesOfTransformation({
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
}: VoicesOfTransformationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  const { testimonials: sanityTestimonials, isLoading, error, refetch } = useTestimonials();

  const testimonials = useMemo(() => {
    if (sanityTestimonials.length > 0) return sanityTestimonials;
    if (!isLoading) return fallbackTestimonials;
    return [];
  }, [sanityTestimonials, isLoading]);

  const scrollCooldown = 400;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calculateCardWidth = () => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const cards = carousel.querySelectorAll('.voice-card');
      if (cards.length > 0) {
        const firstCard = cards[0] as HTMLElement;
        const gap = window.innerWidth >= 1024 ? 32 : window.innerWidth >= 640 ? 24 : 16;
        setCardWidth(firstCard.offsetWidth + gap);
      }
    };

    const timeout = setTimeout(calculateCardWidth, 100);
    window.addEventListener('resize', calculateCardWidth);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateCardWidth);
    };
  }, [testimonials.length, isClient]);

  useEffect(() => {
    if (!resetToStart || !isClient) return;

    currentIndexRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
    lastScrollTimeRef.current = Date.now();

    if (carouselRef.current) {
      gsap.set(carouselRef.current, { x: 0 });
    }
  }, [resetToStart, isClient]);

  useEffect(() => {
    if (!resetToEnd || !isClient || testimonials.length === 0) return;

    const lastIndex = testimonials.length - 1;
    currentIndexRef.current = lastIndex;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(lastIndex);
    lastScrollTimeRef.current = Date.now();

    if (carouselRef.current && cardWidth > 0) {
      gsap.set(carouselRef.current, { x: -lastIndex * cardWidth });
    }
  }, [resetToEnd, isClient, testimonials.length, cardWidth]);

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

  const handleScroll = useCallback(
    (direction: 'up' | 'down') => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (isAnimatingRef.current) return;
      if (testimonials.length === 0 || cardWidth === 0) return;

      const index = currentIndexRef.current;

      if (direction === 'down') {
        if (index < testimonials.length - 1) {
          isAnimatingRef.current = true;
          const newIndex = index + 1;
          currentIndexRef.current = newIndex;
          setCurrentIndex(newIndex);

          gsap.to(carouselRef.current, {
            x: -newIndex * cardWidth,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              isAnimatingRef.current = false;
              lastScrollTimeRef.current = Date.now();
            },
          });
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('end');
        }
      } else {
        if (index > 0) {
          isAnimatingRef.current = true;
          const newIndex = index - 1;
          currentIndexRef.current = newIndex;
          setCurrentIndex(newIndex);

          gsap.to(carouselRef.current, {
            x: -newIndex * cardWidth,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              isAnimatingRef.current = false;
              lastScrollTimeRef.current = Date.now();
            },
          });
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('start');
        }
      }
    },
    [testimonials.length, cardWidth, onEdgeReached],
  );

  // Scoped Observer on containerRef — touch-action:none is on the container
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!containerRef.current) return;
    if (testimonials.length === 0) return;

    const carouselObserver = Observer.create({
      target: containerRef.current,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    carouselObserver.disable();
    observerRef.current = carouselObserver;

    return () => {
      carouselObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, testimonials.length, handleScroll]);

  const sectionTitle = (
    <div className="w-full text-center mb-4 sm:mb-8 lg:mb-10 px-4 pt-4 sm:pt-8 lg:pt-12 flex-shrink-0">
      <h2
        className="text-[26px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
        style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
      >
        Voices of Transformation
      </h2>
    </div>
  );

  if (isLoading && testimonials.length === 0) {
    return (
      <div id="voices" className="relative w-full h-full bg-[#f6edd0]" style={{ clipPath: 'inset(0)' }}>
        <div className="relative w-full h-full flex flex-col justify-center items-center">
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
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div id="voices" className="relative w-full h-full bg-[#f6edd0]" style={{ clipPath: 'inset(0)' }}>
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <div className="w-full text-center mb-6 sm:mb-8 lg:mb-10 px-4 pt-8 sm:pt-12 lg:pt-16">
            <h2
              className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
              style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
            >
              Voices of Transformation
            </h2>
          </div>
          <ErrorState message="Unable to load testimonials. Please try again." onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div id="voices" className="relative w-full h-full bg-[#f6edd0]" style={{ clipPath: 'inset(0)' }}>
        <div className="relative w-full h-full flex flex-col justify-center items-center">
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
      </div>
    );
  }

  return (
    <div
      id="voices"
      ref={containerRef}
      className="relative w-full h-full bg-[#f6edd0]"
      style={{ clipPath: 'inset(0)', touchAction: 'none' }}
    >
      <div className="relative w-full h-full flex flex-col justify-center">
        {sectionTitle}

        <div className="flex-1 flex items-center w-full px-4 sm:px-6 lg:px-10 pb-4 sm:pb-0" style={{ clipPath: 'inset(0)' }}>
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 h-full items-center"
            style={{ willChange: 'transform' }}
          >
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="voice-card shrink-0 rounded-[24px] bg-[#474e3a] p-8 sm:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8 lg:gap-10 justify-start w-[calc(100vw-32px)] sm:w-[90vw] lg:w-[1000px] h-[calc(100%-8px)] sm:h-[clamp(300px,45vh,450px)]"
                style={{
                  isolation: 'isolate',
                  clipPath: 'inset(0 round 24px)',
                  transform: 'translateZ(0)',
                }}
              >
                <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar pr-1">
                  <p
                    className="text-justify text-[#f6edd0]"
                    style={{
                      fontFamily: 'var(--font-graphik), sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      lineHeight: 'clamp(24px, 3.5vw, 30px)',
                    }}
                  >
                    {t.testimonial}
                  </p>
                </div>
                <div className="text-center text-[#f6edd0] shrink-0">
                  <p
                    className="leading-[normal]"
                    style={{
                      fontFamily: 'var(--font-saphira), serif',
                      fontWeight: 400,
                      fontSize: 'clamp(22px, 3vw, 28px)',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="mt-1 uppercase"
                    style={{
                      fontFamily: 'var(--font-graphik), sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(11px, 1.8vw, 14px)',
                      letterSpacing: '1.92px',
                    }}
                  >
                    {t.workshop}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-6 sm:pb-8 lg:pb-12 flex-shrink-0" />
      </div>
    </div>
  );
}
