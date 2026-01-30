'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';
import Button from './Button';
import { getCloudinaryUrl } from '@/lib/cloudinary';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const workCards = [
  {
    text: "At Antar Pravaah, healing is a shared responsibility. We both do the work.",
    imagePosition: 'center' as const,
    isIntro: true,
  },
  {
    text: "Transformation demands commitment and persistence. It's not force, it's flow, but even in that, the commitment to follow the flow is integral to the work.",
    imagePosition: 'right' as const,
  },
  {
    text: "Very often we start with the desire to change everything; we want to fix everything that is not working and bring forth a new version sans the problems of the past. I have been doing this work for 20 years, and I can tell you with a fair bit of certainty, it rarely works.",
    imagePosition: 'left' as const,
  },
  {
    text: 'Why? Because we do want change but often change to the extent of the outermost limits of our own comfort zone. Healing or transformation works when you are willing to take the baby steps out of your comfortable space and step into the unfamiliar.',
    imagePosition: 'right' as const,
  },
];

export default function WeWorkTogether() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Calculate viewport-based dimensions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const readyTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(readyTimeout);
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    const container = containerRef.current;
    const cardsContainer = cardsContainerRef.current;
    if (!container || !cardsContainer) return;

    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('.work-card'));
    if (cards.length < 2) return;

    // Set initial states - all cards hidden except first
    gsap.set(cards, {
      autoAlpha: 0,
      scale: 0.95,
      y: 30,
    });
    gsap.set(cards[0], { autoAlpha: 1, scale: 1, y: 0 });

    // Create timeline for card transitions
    const tl = gsap.timeline();

    // Build card transition animations
    cards.forEach((card, index) => {
      if (index === 0) return; // Skip first card (already visible)
      
      const prevCard = cards[index - 1];
      
      // Add label for this card
      tl.addLabel(`card${index}`);
      
      // Fade out previous card
      tl.to(prevCard, {
        autoAlpha: 0,
        scale: 0.95,
        y: -20,
        duration: 0.5,
        ease: 'power2.inOut',
      });
      
      // Fade in current card
      tl.to(card, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '<0.2');
    });

    // Add final label
    tl.addLabel(`card${cards.length}`);

    // Calculate scroll distance (more distance = more scroll needed per card)
    const isMobile = window.innerWidth < 640;
    const scrollPerCard = isMobile ? 150 : 200;
    const totalScrollDistance = (cards.length - 1) * scrollPerCard;

    // Get header height for proper positioning
    const headerHeight = window.innerWidth >= 1024 ? 148 : window.innerWidth >= 640 ? 108 : 90;
    
    // Create ScrollTrigger with snap
    const st = ScrollTrigger.create({
      id: 'WORK-CARDS-SNAP',
      trigger: container,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      // Start pinning when section top reaches just below the header
      start: `top top+=${headerHeight}`,
      end: `+=${totalScrollDistance}`,
      scrub: 0.5,
      animation: tl,
      snap: {
        snapTo: 'labelsDirectional',
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        ease: 'power2.inOut',
      },
      invalidateOnRefresh: true,
    });

    // Refresh after setup
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 200);

    return () => {
      clearTimeout(refreshTimeout);
      st.kill();
      tl.kill();
    };
  }, [isReady]);

  // Get image sources
  const imageSrcs = [
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_one'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_two'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_three'),
    getCloudinaryUrl('antarpravaah/we-work/we_work_together_vector_four'),
  ];

  return (
    <Section
      id="work-together"
      className="relative w-full bg-[#f6edd0]"
      ref={sectionRef}
    >
      {/* Full viewport container - height accounts for header */}
      <div 
        ref={containerRef} 
        className="relative w-full flex flex-col bg-[#f6edd0]"
        style={{ 
          minHeight: 'calc(100vh - var(--header-height, 90px))',
          height: 'calc(100vh - var(--header-height, 90px))',
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="/about_splash_vector.svg"
            alt=""
            className="absolute w-[400px] sm:w-[500px] lg:w-[580px] h-auto opacity-100"
            style={{
              top: '15%',
              left: '3%',
              filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
            }}
          />
          <img
            src="/about_splash_vector.svg"
            alt=""
            className="absolute w-[400px] sm:w-[500px] lg:w-[580px] h-auto opacity-100"
            style={{
              top: '25%',
              right: '3%',
              transform: 'rotate(45deg)',
              filter: 'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(497%) hue-rotate(16deg) brightness(95%) contrast(92%)'
            }}
          />
        </div>

        {/* Section Title */}
        <div className="relative z-10 w-full text-center pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8">
          <h2
            className="text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            We Work Together
          </h2>
        </div>

        {/* Cards Container - Centered in remaining viewport */}
        <div 
          ref={cardsContainerRef}
          className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16"
        >
          <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[1000px]">
            {/* Card Stack - All cards positioned absolutely */}
            <div 
              className="relative w-full"
              style={{ 
                height: 'clamp(400px, 60vh, 600px)',
              }}
            >
              {/* Intro Card */}
              <div 
                className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center"
              >
                <div className="flex-1 flex items-center justify-center max-h-[60%] sm:max-h-[65%]">
                  <Image
                    src={imageSrcs[0]}
                    alt=""
                    width={430}
                    height={450}
                    quality={85}
                    loading="lazy"
                    className="w-auto h-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] object-contain"
                  />
                </div>
                <p
                  className="text-center text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.5] text-[#645c42] max-w-[90%] mt-4 sm:mt-6"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  {workCards[0].text}
                </p>
              </div>

              {/* Content Cards */}
              {workCards.slice(1).map((card, index) => {
                const isLeft = card.imagePosition === 'left';
                const imageSrc = imageSrcs[index + 1] || imageSrcs[1];
                
                return (
                  <div
                    key={index}
                    className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d6c68e] p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center"
                  >
                    <div
                      className={`flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 w-full h-full justify-center ${
                        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt=""
                          width={200}
                          height={200}
                          quality={85}
                          loading="lazy"
                          className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
                        />
                      </div>
                      <p
                        className="flex-1 text-justify text-[13px] sm:text-[14px] lg:text-[16px] leading-[1.5] sm:leading-[1.6] text-[#645c42] px-1 sm:px-2"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        {card.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card */}
              <div 
                className="work-card absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#645c42] p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center"
              >
                <Button text="Explore Our Approach" size="large" mode="light" href="/approach" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
