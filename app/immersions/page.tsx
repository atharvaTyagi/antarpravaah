'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import Footer from '@/components/Footer';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { ImmersionCard, TrainingCard, type ImmersionData, type TrainingData } from '@/components/ImmersionTrainingCard';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Immersions data
const immersionsData: ImmersionData[] = [
  {
    id: 'antar-smaran',
    title: 'Antar Smaran Immersive Residential Retreat',
    type: 'immersion',
    duration: '2 Days',
    language: 'English and Hindi',
    prerequisite: '21 years and above\nNo prior experience required.',
    format: 'In-person',
    about: 'Antar Smaran is a once-a-year residential retreat designed to guide participants into deep connection with their inner self and the natural flow of life within. This immersion weaves together the principles of energy healing, inner child integration, and shamanic practices with the timeless wisdom of ancient yogic traditions. Grounded yet expansive, the Antar Smaran Immersive helps you create a daily roadmap rooted in awareness, balance, and compassion.',
    whatToExpect: [
      'Meditations and energy healing to awaken flow',
      'Inner child work to release old patterns',
      'Shamanic practices to expand awareness',
      'Yogic techniques for inner awareness',
    ],
    image: getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_1'),
    ctaText: 'Reserve your spot',
  },
  {
    id: 'thread-of-life',
    title: 'Thread of Life - A Systemic Constellations experience',
    type: 'immersion',
    duration: '6 Hours (10AM - 4PM)',
    language: 'English',
    prerequisite: '16 years and above. No prior experience required.',
    format: 'In-person',
    about: 'These thematic constellation workshops explore collective and individual patterns in a supportive space. Whether you represent, have your own issue addressed, or observe, the process offers insights for everyone. Through participation and reflection, collective wisdom emerges, providing clarity, healing, and guidance to take into daily life.',
    whatToExpect: [
      'Gain insights, healing, and clarity',
      'Witness transformative dynamics in action',
      'Get an overview of systemic work',
    ],
    image: getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_2'),
    ctaText: 'Reserve your spot',
  },
  {
    id: 'animal-guide',
    title: 'Meet your Primary Animal Guide',
    type: 'workshop',
    duration: '3 Hours',
    language: 'English',
    prerequisite: 'Open to everyone above 11 years',
    format: 'Online',
    about: 'In Shamanism, connecting with your personal animal guide is a foundational step. Animals serve as gatekeepers of the natural spirit world, guiding us on journeys into the unseen.',
    whatToExpect: [
      'Identify your own Primary spirit animal guide',
    ],
    image: getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_3'),
    ctaText: 'Reserve your spot',
  },
];

// Trainings data
const trainingsData: TrainingData[] = [
  {
    id: 'shamanic-foundations',
    title: 'Foundations of Shamanic Practice',
    duration: 'Total 30 hours\n3-hour Classes\nTwice a month',
    prerequisites: '17 and above\nOpen to everyone',
    format: 'Online',
    language: 'English',
    overview: 'This is the Foundation course in Shamanic Arts that offers participants an insight into what Shamanism is, its origins and its practice.',
    whatYoullLearn: [
      'Identify your Primary Animal Spirit guide',
      'Understand Shamanic Journeys',
      'Archetypal energies in Shamanism',
      'Fundamental tools in Shamanic work',
    ],
    ctaText: 'Enroll in this Training',
  },
  {
    id: 'energy-healing-l1',
    title: 'Antar Pravaah Energy Healing Level 1',
    duration: 'Total 12 hours, Weekend Classes',
    prerequisites: '18+, No prior experience required',
    format: 'In-person',
    language: 'English and Hindi',
    overview: 'The Level 1 AP Energy Healing course is designed to familiarise participants with the concept of Energy in respect to Healing and learn tools for self healing.',
    whatYoullLearn: [
      'Nature of energy',
      'Basic human physiology',
      'Principles of self healing',
      'Tools for Self Healing',
    ],
    ctaText: 'Enroll in this Training',
  },
  {
    id: 'chakra-fundamentals',
    title: 'Chakra Energy System Fundamentals',
    duration: 'Total 15 hours, 3-hour Class Weekly',
    prerequisites: '18+, No prior experience required',
    format: 'Hybrid - Online & In-person',
    language: 'English & Hindi',
    overview: 'Chakras are the blueprints upon which the Human body is created and experienced. This training enables the understanding of this complex system.',
    whatYoullLearn: [
      'What Chakras are and are NOT',
      'Interactions in life experience',
      'Tools to harmonise energy flow',
    ],
    ctaText: 'Enroll in this Training',
  },
];

// Section configuration with theme mapping
const SECTIONS: { id: string; type: 'static' | 'carousel' | 'footer'; themeId: SectionId }[] = [
  { id: 'intro', type: 'static', themeId: 'immersions' },
  { id: 'immersions-intro', type: 'static', themeId: 'immersions-intro' },
  { id: 'immersions-carousel', type: 'carousel', themeId: 'immersions-listings' },
  { id: 'trainings-intro', type: 'static', themeId: 'trainings-intro' },
  { id: 'trainings-carousel', type: 'carousel', themeId: 'trainings-listings' },
  { id: 'cta', type: 'static', themeId: 'cta' },
  { id: 'footer', type: 'footer', themeId: 'immersions' },
];

export default function ImmersionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const immersionsCarouselRef = useRef<HTMLDivElement>(null);
  const trainingsCarouselRef = useRef<HTMLDivElement>(null);
  
  const setTheme = useThemeStore((state) => state.setTheme);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // Carousel scroll positions (in pixels)
  const immersionsScrollX = useRef(0);
  const trainingsScrollX = useRef(0);
  const immersionsMaxScroll = useRef(0);
  const trainingsMaxScroll = useRef(0);
  
  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 800; // ms cooldown for section changes

  // Get header height based on screen size
  const getHeaderHeight = useCallback(() => {
    if (typeof window === 'undefined') return 90;
    return window.innerWidth >= 1024 ? 148 : window.innerWidth >= 640 ? 108 : 90;
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set initial theme
    setTheme(SECTIONS[0].themeId);

    // Mark ready after initial setup
    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(readyTimeout);
    };
  }, [setTheme]);

  // Calculate max scroll for carousels
  useLayoutEffect(() => {
    if (!isReady) return;
    
    const calculateMaxScroll = () => {
      if (immersionsCarouselRef.current) {
        const containerWidth = immersionsCarouselRef.current.parentElement?.clientWidth || window.innerWidth;
        immersionsMaxScroll.current = Math.max(0, immersionsCarouselRef.current.scrollWidth - containerWidth + 32);
      }
      if (trainingsCarouselRef.current) {
        const containerWidth = trainingsCarouselRef.current.parentElement?.clientWidth || window.innerWidth;
        trainingsMaxScroll.current = Math.max(0, trainingsCarouselRef.current.scrollWidth - containerWidth + 32);
      }
    };

    calculateMaxScroll();
    window.addEventListener('resize', calculateMaxScroll);
    
    return () => window.removeEventListener('resize', calculateMaxScroll);
  }, [isReady]);

  // Handle card expanded change - lock/unlock scrolling
  const handleCardExpandedChange = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded);
    
    if (typeof window !== 'undefined') {
      const lenis = (window as Window & { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
      if (expanded) {
        lenis?.stop?.();
      } else {
        lenis?.start?.();
      }
    }
  }, []);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;
    
    const container = containerRef.current;
    const targetSection = sectionsRef.current[index];
    if (!container || !targetSection) return;

    setIsAnimating(true);
    
    // Update theme immediately for smooth header transition
    setTheme(SECTIONS[index].themeId);
    
    // Use actual section offsetTop for precise positioning
    const targetY = -targetSection.offsetTop;
    
    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection(index);
        
        // Reset carousel position when entering from the appropriate direction
        const section = SECTIONS[index];
        if (section.type === 'carousel') {
          if (section.id === 'immersions-carousel') {
            const targetX = direction === 'down' ? 0 : immersionsMaxScroll.current;
            immersionsScrollX.current = targetX;
            if (immersionsCarouselRef.current) {
              gsap.set(immersionsCarouselRef.current, { x: -targetX });
            }
          } else if (section.id === 'trainings-carousel') {
            const targetX = direction === 'down' ? 0 : trainingsMaxScroll.current;
            trainingsScrollX.current = targetX;
            if (trainingsCarouselRef.current) {
              gsap.set(trainingsCarouselRef.current, { x: -targetX });
            }
          }
        }
        
        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, getHeaderHeight, setTheme]);

  // Update carousel position smoothly
  const updateCarouselPosition = useCallback((carouselType: 'immersions' | 'trainings', delta: number) => {
    const carouselRef = carouselType === 'immersions' ? immersionsCarouselRef : trainingsCarouselRef;
    const scrollXRef = carouselType === 'immersions' ? immersionsScrollX : trainingsScrollX;
    const maxScroll = carouselType === 'immersions' ? immersionsMaxScroll.current : trainingsMaxScroll.current;
    
    if (!carouselRef.current) return { atStart: false, atEnd: false };
    
    // Calculate new position
    const scrollSpeed = isMobile ? 1.5 : 2;
    const newX = Math.max(0, Math.min(maxScroll, scrollXRef.current + delta * scrollSpeed));
    scrollXRef.current = newX;
    
    // Animate to new position
    gsap.to(carouselRef.current, {
      x: -newX,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true,
    });
    
    return {
      atStart: newX <= 0,
      atEnd: newX >= maxScroll,
    };
  }, [isMobile]);

  // Handle scroll input
  const handleScroll = useCallback((deltaY: number) => {
    if (isCardExpanded || isAnimating) return;
    
    const section = SECTIONS[currentSection];
    const isScrollingDown = deltaY > 0;
    
    if (section.type === 'carousel') {
      // In carousel section - scroll horizontally first
      const carouselType = section.id === 'immersions-carousel' ? 'immersions' : 'trainings';
      const { atStart, atEnd } = updateCarouselPosition(carouselType, deltaY);
      
      // Check if we should transition to next/prev section
      const now = Date.now();
      const canChangeSection = now - lastScrollTimeRef.current > sectionScrollCooldown;
      
      if (isScrollingDown && atEnd && canChangeSection) {
        goToSection(currentSection + 1, 'down');
      } else if (!isScrollingDown && atStart && canChangeSection) {
        goToSection(currentSection - 1, 'up');
      }
    } else {
      // Static section - change sections with cooldown
      const now = Date.now();
      if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
      lastScrollTimeRef.current = now;
      
      if (isScrollingDown) {
        goToSection(currentSection + 1, 'down');
      } else {
        goToSection(currentSection - 1, 'up');
      }
    }
  }, [isCardExpanded, isAnimating, currentSection, updateCarouselPosition, goToSection]);

  // Setup GSAP Observer for scroll/touch handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    // Stop Lenis for this page
    const lenis = (window as Window & { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
    lenis?.stop?.();

    document.body.style.overflow = 'hidden';

    // Wheel event handler for continuous scrolling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!isCardExpanded) {
        handleScroll(e.deltaY);
      }
    };

    // Touch event handlers
    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isCardExpanded) {
        const currentY = e.touches[0].clientY;
        const deltaY = lastTouchY - currentY;
        lastTouchY = currentY;
        handleScroll(deltaY * 2); // Multiply for sensitivity
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      lenis?.start?.();
    };
  }, [isReady, isCardExpanded, handleScroll]);

  // Section height style
  const sectionStyle = {
    height: `calc(100vh - var(--header-height, 90px))`,
    minHeight: `calc(100vh - var(--header-height, 90px))`,
  };

  // Desktop card width - 60% of viewport for first card visibility
  const desktopCardWidth = 'calc(60vw - 64px)';

  return (
    <>
      {/* CSS Variables for header height */}
      <style jsx global>{`
        :root {
          --header-height: 90px;
        }
        @media (min-width: 640px) {
          :root {
            --header-height: 108px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --header-height: 148px;
          }
        }
      `}</style>

      <main className="fixed inset-0 top-[var(--header-height)] overflow-hidden bg-[#f6edd0] z-[30]">
        <div ref={containerRef} className="will-change-transform">
          {/* ===== SECTION 1: Hero/Introduction ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[0] = el; }}
            className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0]"
            style={sectionStyle}
          >
            <div className="mx-auto flex max-w-full sm:max-w-[600px] lg:max-w-[723px] flex-col items-center gap-4 sm:gap-5 lg:gap-6 text-center">
              <h1
                className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Immersions & Trainings
              </h1>
              <h2
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#6a3f33] uppercase tracking-[2.5px] sm:tracking-[3px] lg:tracking-[2.56px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Gather, Learn, Transform Together
              </h2>
              <div
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center text-[#6a3f33] px-2"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p className="mb-4">
                  Healing deepens when experienced in community. Whether you&apos;re exploring a theme that
                  resonates with your journey, or stepping into the role of healer yourself, our immersions
                  & trainings create sacred containers for collective transformation.
                </p>
                <p>
                  Here, you&apos;ll find workshops that illuminate life&apos;s patterns, training programs that
                  empower you to become your own healer, and gatherings that remind you—you&apos;re not alone on
                  this path.
                </p>
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: Immersions Introduction ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[1] = el; }}
            className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#f6edd0]"
            style={sectionStyle}
          >
            {/* Decorative blob background */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <img
                src="/immersion_main_blob.svg"
                alt=""
                className="w-[min(1171px,150vw)] h-auto opacity-30"
              />
            </div>

            <div className="relative z-10 mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1000px]">
              {/* Mobile: Cluster images at top */}
              {isMobile && (
                <div className="relative w-[313px] h-[280px] mx-auto mb-6">
                  <div className="absolute top-0 left-0 w-[120px] h-[126px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/immersion_1')}
                      alt=""
                      width={120}
                      height={126}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-[60px] left-[148px] w-[112px] h-[118px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/immersion_2')}
                      alt=""
                      width={112}
                      height={118}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-[130px] left-[6px] w-[146px] h-[153px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/immersion_3')}
                      alt=""
                      width={146}
                      height={153}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Three column layout (desktop) */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6 lg:gap-12">
                {/* Left decorative image - hidden on mobile */}
                <div className="pointer-events-none hidden md:flex items-center justify-center lg:mt-8">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/immersions/immersion_1')}
                    alt=""
                    width={200}
                    height={200}
                    quality={85}
                    loading="lazy"
                    className="w-[120px] sm:w-[160px] lg:w-[200px] h-auto object-contain"
                  />
                </div>

                {/* Center content */}
                <div className="flex w-full max-w-[400px] flex-col items-center gap-2 sm:gap-3 text-center text-[#6a3f33]">
                  <h2
                    className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Immersions
                  </h2>
                  <h3
                    className="hidden md:block text-[14px] sm:text-[15px] lg:text-[16px] uppercase leading-normal tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    Transformative Gatherings
                  </h3>
                  <div
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-justify md:text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-3">
                      Immersions at Antar Pravaah focus on meaningful themes without delving deeply into personal
                      histories. These gatherings create space for broader awareness.
                    </p>
                    <p>
                      Through group exploration, you&apos;ll gain insights into life patterns and connections,
                      supported by community energy.
                    </p>
                  </div>
                </div>

                {/* Right decorative image - hidden on mobile */}
                <div className="pointer-events-none hidden lg:flex items-center justify-center lg:mt-16">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/immersions/immersion_2')}
                    alt=""
                    width={180}
                    height={180}
                    quality={85}
                    loading="lazy"
                    className="w-[140px] lg:w-[180px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Bottom center decorative image - hidden on mobile */}
              <div className="pointer-events-none mx-auto mt-6 hidden md:flex items-center justify-center">
                <Image
                  src={getCloudinaryUrl('antarpravaah/immersions/immersion_3')}
                  alt=""
                  width={280}
                  height={280}
                  quality={85}
                  loading="lazy"
                  className="w-[180px] sm:w-[220px] lg:w-[280px] h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: Immersions Carousel (Dark) ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[2] = el; }}
            className="relative flex flex-col bg-[#6a3f33]"
            style={sectionStyle}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-16 pt-6 pb-4">
              <div
                className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                {isMobile ? (
                  <>
                    <span className="block">Upcoming Immersions</span>
                    <span className="block">& Workshops</span>
                  </>
                ) : (
                  'Upcoming Immersions & Workshops'
                )}
              </div>
            </div>

            {/* Carousel */}
            <div className="flex-1 flex items-center overflow-hidden px-4 sm:px-6 lg:px-16 py-4">
              <div
                ref={immersionsCarouselRef}
                className="flex gap-4 sm:gap-6 will-change-transform h-full"
              >
                {immersionsData.map((immersion) => (
                  <div
                    key={immersion.id}
                    className="carousel-card shrink-0 h-full"
                    style={{ width: isMobile ? 'calc(100vw - 32px)' : desktopCardWidth }}
                  >
                    <ImmersionCard
                      data={immersion}
                      isMobile={isMobile}
                      onExpandedChange={handleCardExpandedChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 4: Trainings Introduction ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[3] = el; }}
            className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#f6edd0]"
            style={sectionStyle}
          >
            {/* Decorative blob background - rotated */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <div className="rotate-[130deg] scale-y-[-1]">
                <img
                  src="/immersion_main_blob.svg"
                  alt=""
                  className="w-[min(1171px,150vw)] h-auto opacity-30"
                />
              </div>
            </div>

            <div className="relative z-10 mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1000px]">
              {/* Mobile: Cluster images at top (inverted layout) */}
              {isMobile && (
                <div className="relative w-[313px] h-[280px] mx-auto mb-6 transform rotate-180">
                  <div className="absolute top-0 left-0 w-[120px] h-[126px] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_1')}
                      alt=""
                      width={120}
                      height={126}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-[60px] left-[148px] w-[112px] h-[118px] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_2')}
                      alt=""
                      width={112}
                      height={118}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-[130px] left-[6px] w-[146px] h-[153px] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_3')}
                      alt=""
                      width={146}
                      height={153}
                      quality={85}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Three column layout (desktop) */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6 lg:gap-12">
                {/* Left decorative image - hidden on mobile */}
                <div className="pointer-events-none hidden md:flex items-center justify-center lg:mt-8">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/trainings/training_1')}
                    alt=""
                    width={200}
                    height={200}
                    quality={85}
                    loading="lazy"
                    className="w-[120px] sm:w-[160px] lg:w-[200px] h-auto object-contain"
                  />
                </div>

                {/* Center content */}
                <div className="flex w-full max-w-[400px] flex-col items-center gap-2 sm:gap-3 text-center text-[#6a3f33]">
                  <h2
                    className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Trainings
                  </h2>
                  <h3
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] md:uppercase md:leading-normal md:tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: isMobile ? 500 : 300 }}
                  >
                    Become Your Own Healer
                  </h3>
                  <div
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-justify md:text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-3">
                      Our training programs offer more than certification—they offer transformation. As you learn to facilitate healing for others, you become your own most skilled healer.
                    </p>
                    <p>
                      Each training includes hands-on practice, personal healing work, mentorship, and certification.
                    </p>
                  </div>
                </div>

                {/* Right decorative image - hidden on mobile */}
                <div className="pointer-events-none hidden lg:flex items-center justify-center lg:mt-16">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/trainings/training_2')}
                    alt=""
                    width={180}
                    height={180}
                    quality={85}
                    loading="lazy"
                    className="w-[140px] lg:w-[180px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Bottom center decorative image - hidden on mobile */}
              <div className="pointer-events-none mx-auto mt-6 hidden md:flex items-center justify-center">
                <Image
                  src={getCloudinaryUrl('antarpravaah/trainings/training_3')}
                  alt=""
                  width={280}
                  height={280}
                  quality={85}
                  loading="lazy"
                  className="w-[180px] sm:w-[220px] lg:w-[280px] h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* ===== SECTION 5: Trainings Carousel (Dark) ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[4] = el; }}
            className="relative flex flex-col bg-[#6a3f33]"
            style={sectionStyle}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-16 pt-6 pb-4">
              <div
                className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Upcoming Trainings
              </div>
            </div>

            {/* Carousel */}
            <div className="flex-1 flex items-center overflow-hidden px-4 sm:px-6 lg:px-16 py-4">
              <div
                ref={trainingsCarouselRef}
                className="flex gap-4 sm:gap-6 will-change-transform h-full"
              >
                {trainingsData.map((training) => (
                  <div
                    key={training.id}
                    className="carousel-card shrink-0 h-full"
                    style={{ width: isMobile ? 'calc(100vw - 32px)' : desktopCardWidth }}
                  >
                    <TrainingCard
                      data={training}
                      isMobile={isMobile}
                      onExpandedChange={handleCardExpandedChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 6: CTA ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[5] = el; }}
            className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0]"
            style={sectionStyle}
          >
            <div className="mx-auto flex max-w-full sm:max-w-[600px] lg:max-w-[687px] flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
              <h2
                className="text-[36px] sm:text-[40px] lg:text-[48px] leading-[1.0] text-[#d58761]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Ready to step into your power?
              </h2>

              <div className="flex items-center justify-center">
                <PageEndBlob color="#d58761" className="w-[100px] sm:w-[130px] lg:w-[163px] h-auto" />
              </div>

              <p
                className="text-[16px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-normal text-[#d58761] px-4 text-center"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                Whether you&apos;re joining us for a single workshop or embarking on a comprehensive training
                journey, every gathering is an opportunity for transformation.
              </p>

              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                {isMobile ? (
                  <>
                    <button
                      className="flex items-center justify-center gap-2 p-3 text-[#6a3f33] hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                    >
                      <span className="text-center text-[18px] tracking-[2.88px] uppercase leading-tight px-2 py-1">
                        <span className="block">Explore</span>
                        <span className="block">our Upcoming</span>
                        <span className="block">Immersions</span>
                      </span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 p-3 text-[#6a3f33] hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                    >
                      <span className="text-center text-[18px] tracking-[2.88px] uppercase leading-tight px-2 py-1">
                        <span className="block">View</span>
                        <span className="block">our Training</span>
                        <span className="block">Programs</span>
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      text="Explore Upcoming Immersions"
                      size="large"
                      colors={{
                        fg: '#6a3f33',
                        fgHover: '#d58761',
                        bgHover: '#6a3f33',
                      }}
                    />
                    <Button
                      text="View Training Programs"
                      size="large"
                      colors={{
                        fg: '#6a3f33',
                        fgHover: '#d58761',
                        bgHover: '#6a3f33',
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ===== SECTION 7: Footer ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[6] = el; }}
            className="relative flex items-center bg-[#6a3f33]"
            style={sectionStyle}
          >
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
