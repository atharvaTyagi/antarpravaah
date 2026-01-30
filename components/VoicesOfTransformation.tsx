'use client';

import Section from './Section';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    copy: `Namita's healing sessions have truly transformed how I feel — lighter, calmer, and genuinely happier. I'm deeply thankful for her guidance and energy. Since I started going to her, something within me has shifted; my entire mindset feels more open and at peace. Her work has been such a beautiful influence in my life.`,
    name: 'ROMA PRIYA',
    subtitle: 'Access Energetic Facelift/ SOP',
  },
  {
    copy: `What has unfolded since I met Namita has been a journey far beyond what I could have imagined. What sets Namita apart is the way she holds 'space' with love, clarity, and quiet strength allowing one's own awakening to unfold. She has helped me see the interconnectedness of all life, how every part of nature lives within us, and we within it. She embodies the spirit of a real shaman: compassionate, wise, and rooted in love.`,
    name: 'UMPILIKA',
    subtitle: 'Foot Reflexology/ Shamanic Student/ Distance Healing/ Antar Smaran Process/ Systemic Constellations',
  },
  {
    copy: `Namita has helped me breathe—literally and figuratively. I first consulted her for a tennis elbow, which she sorted out for me, very quickly and permanently. Thereafter, a severe issue with suffocation was resolved. Over the years, she has helped me change from a barren, harsh landscape, unforgiving to myself to a greener, more open, self-nurturing space. Namita's intuitive skills, combined with her humour and compassion and practicality that weave a warm, comforting space for healing the mind, body and soul. Mine, for sure.`,
    name: 'RACHNA TIWARI',
    subtitle: 'Foot Reflexology/ Access Bars/ Systemic Constellations',
  },
];

export default function VoicesOfTransformation() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(readyTimeout);
    };
  }, []);

  // Setup horizontal scroll animation with snap to each card
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    const container = containerRef.current;
    const carousel = carouselRef.current;
    if (!container || !carousel) return;

    // Wait for layout to settle
    const setupTimeout = setTimeout(() => {
      const cards = carousel.querySelectorAll('.voice-card');
      const cardCount = cards.length;
      
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
  }, [isReady]);

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
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="voice-card shrink-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#474e3a] p-5 sm:p-8 lg:p-10 flex flex-col"
                style={{
                  width: 'min(850px, 85vw)',
                  height: 'clamp(350px, 50vh, 500px)',
                }}
              >
                <p
                  className="flex-1 text-justify text-[14px] sm:text-[18px] lg:text-[22px] leading-[1.5] sm:leading-[1.6] text-[#f6edd0] overflow-y-auto"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  {t.copy}
                </p>
                <div className="mt-auto pt-4 sm:pt-6 lg:pt-8 text-center text-[#f6edd0]">
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
                    {t.subtitle}
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
