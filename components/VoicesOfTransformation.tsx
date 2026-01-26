'use client';

import Section from './Section';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VoicesOfTransformation() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  // Normalize card heights to the tallest card so footer (name/subtitle) aligns across the carousel.
  useLayoutEffect(() => {
    const compute = () => {
      const heights = cardRefs.current
        .map((el) => el?.getBoundingClientRect().height ?? 0)
        .filter((h) => h > 0);
      const max = heights.length ? Math.max(...heights) : 0;
      setCardHeight(max > 0 ? Math.ceil(max) : null);
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Setup horizontal scroll animation with pinning
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    const carousel = carouselRef.current;
    if (!container || !carousel) return;

    // Wait for layout to settle
    const setupTimeout = setTimeout(() => {
      // Calculate total horizontal scroll distance
      const scrollWidth = carousel.scrollWidth - window.innerWidth + 80; // Add padding offset

      // Create horizontal scroll animation
      const scrollTween = gsap.to(carousel, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();

      return () => {
        scrollTween.kill();
      };
    }, 700);

    return () => {
      clearTimeout(setupTimeout);
      // Clean up ScrollTriggers for this component
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) {
          st.kill();
        }
      });
    };
  }, [cardHeight]); // Re-run when card heights are calculated

  const testimonials = [
    {
      copy: `Namita’s healing sessions have truly transformed how I feel — lighter, calmer, and genuinely happier. I’m deeply thankful for her guidance and energy. Since I started going to her, something within me has shifted; my entire mindset feels more open and at peace. Her work has been such a beautiful influence in my life.`,
      name: 'ROMA PRIYA',
      subtitle: 'Access Energetic Facelift/ SOP',
    },
    {
      copy: `What has unfolded since I met Namita has been a journey far beyond what I could have imagined. What sets Namita apart is the way she holds ‘space’ with love, clarity, and quiet strength allowing one’s own awakening to unfold. She has helped me see the interconnectedness of all life, how every part of nature lives within us, and we within it. She embodies the spirit of a real shaman: compassionate, wise, and rooted in love.`,
      name: 'UMPILIKA',
      subtitle:
        'FOOT REFLEXOLOGY/ SHAMANIC STUDENT/ DISTANCE HEALING/ Antar Smaran Process/ SYSTEMIC CONSTELLATIONS',
    },
    {
      copy: `Namita has helped me breathe—literally and figuratively. I first consulted her for a tennis elbow, which she sorted out for me, very quickly and permanently. Thereafter, a severe issue with suffocation was resolved. Over the years, she has helped me change from a barren, harsh landscape, unforgiving to myself to a greener, more open, self-nurturing space. Namita’s intuitive skills, combined with her humour and compassion and practicality that weave a warm, comforting space for healing the mind, body and soul. Mine, for sure.`,
      name: 'RACHNA TIWARI',
      subtitle: 'FOOT REFLEXOLOGY/ ACCESS BARS/ SYSTEMIC CONSTELLATIONS',
    },
  ];

  return (
    <Section
      id="voices"
      className="relative w-full bg-[#f6edd0]"
      ref={sectionRef}
    >
      {/* Carousel Container - This gets pinned */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Section Title */}
        <div className="w-full text-center mb-6 lg:mb-8 px-4">
          <h2
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#474e3a]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Voices of Transformation
          </h2>
        </div>

        {/* Carousel Track */}
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 will-change-transform"
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="shrink-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] border border-[#474e3a] bg-[#474e3a] p-6 sm:p-8 lg:p-10"
                style={{
                  width: 'min(911px, 85vw)',
                  height: cardHeight ?? undefined,
                }}
              >
                <div className="flex h-full flex-col">
                  <p
                    className="flex-1 text-justify text-[16px] sm:text-[20px] lg:text-[24px] leading-[normal] text-[#f6edd0]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    {t.copy}
                  </p>
                  <div className="mt-auto pt-6 sm:pt-8 lg:pt-10 text-center text-[#f6edd0]">
                    <p
                      className="text-[20px] sm:text-[22px] lg:text-[24px] leading-[normal]"
                      style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.7px] lg:tracking-[1.92px]"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                    >
                      {t.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}


