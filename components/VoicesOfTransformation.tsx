'use client';

import Section from './Section';
import Button from './Button';
import PageEndBlob from './PageEndBlob';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function VoicesOfTransformation() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isScrollTakeoverActive, setIsScrollTakeoverActive] = useState(false);
  const bodyScrollLock = useRef<{ overflow: string; paddingRight: string } | null>(null);
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

  // Convert vertical wheel/trackpad scroll into horizontal carousel scroll while this section is active.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrollTakeoverActive(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        // Activate when the section is meaningfully in view (below the sticky header).
        rootMargin: '-220px 0px -220px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lockBodyScroll = () => {
      if (bodyScrollLock.current) return;
      const body = document.body;
      const docEl = document.documentElement;
      const scrollbarWidth = window.innerWidth - docEl.clientWidth;
      bodyScrollLock.current = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    };

    const unlockBodyScroll = () => {
      const prev = bodyScrollLock.current;
      if (!prev) return;
      document.body.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.paddingRight;
      bodyScrollLock.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isScrollTakeoverActive) return;
      const scroller = scrollerRef.current;
      if (!scroller) return;

      // If user is using shift+wheel for horizontal, let the browser handle it.
      if (e.shiftKey) return;

      const primaryDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!primaryDelta) return;

      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (maxScrollLeft <= 0) return;
      const atStart = scroller.scrollLeft <= 0;
      const atEnd = scroller.scrollLeft >= maxScrollLeft - 1;

      // Only "take over" if we can actually scroll horizontally in that direction.
      const scrollingForward = primaryDelta > 0; // right
      const canScrollRight = !atEnd;
      const canScrollLeft = !atStart;

      if ((scrollingForward && !canScrollRight) || (!scrollingForward && !canScrollLeft)) {
        unlockBodyScroll();
        return; // release back to normal vertical page scroll
      }

      e.preventDefault();
      lockBodyScroll();
      scroller.scrollLeft += primaryDelta;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      unlockBodyScroll();
    };
  }, [isScrollTakeoverActive]);

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
      className="relative min-h-screen w-full bg-[#f6edd0] pb-24 pt-[96px]"
      ref={sectionRef}
    >
      {/* Carousel */}
      <div className="w-full px-10 pt-10">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex w-full gap-4 overflow-x-auto overscroll-contain pb-6 touch-pan-x"
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="shrink-0 rounded-[24px] border border-[#474e3a] bg-[#474e3a] p-10"
              style={{
                width: 'min(911px, 90vw)',
                height: cardHeight ?? undefined,
              }}
            >
              <div className="flex h-full flex-col">
                <p
                  className="flex-1 text-justify text-[24px] leading-[normal] text-[#f6edd0]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  {t.copy}
                </p>
                <div className="mt-auto pt-10 text-center text-[#f6edd0]">
                  <p
                    className="text-[24px] leading-[normal]"
                    style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="mt-1 text-[12px] uppercase tracking-[1.92px]"
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

      {/* CTA */}
      <div className="mx-auto w-full max-w-[1177px] px-10 pb-10">
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="flex items-center justify-center py-5">
            <PageEndBlob className="h-10 w-auto" />
          </div>
          <p
            className="text-center text-[48px] leading-[normal] text-[#93a378]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            Ready to begin your own transformation?
          </p>
          <Button text="Begin Your Journey" size="large" mode="dark" />
        </div>
      </div>
    </Section>
  );
}


