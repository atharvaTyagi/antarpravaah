'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import Footer from '@/components/Footer';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { ImmersionCard, TrainingCard, type ImmersionData, type TrainingData } from '@/components/ImmersionTrainingCard';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';
import { useImmersions, useTrainings } from '@/sanity/lib/queries';


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
  { id: 'footer', type: 'footer', themeId: 'immersions-footer' },
];

// Component that uses searchParams - wrapped in Suspense
function ImmersionsPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const immersionsCarouselScrollRef = useRef<HTMLDivElement>(null);
  const trainingsCarouselScrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  const setTheme = useThemeStore((state) => state.setTheme);
  
  // Fetch data from Sanity
  const { immersions: sanityImmersions, isLoading: immersionsLoading } = useImmersions();
  const { trainings: sanityTrainings, isLoading: trainingsLoading } = useTrainings();
  
  // Use Sanity data if available, otherwise fall back to hardcoded data
  const activeImmersions: ImmersionData[] = sanityImmersions.length > 0 
    ? sanityImmersions.map(item => ({
        _id: item._id,
        id: item._id,
        title: item.title,
        slug: item.slug,
        type: item.type,
        duration: item.duration,
        language: item.language,
        prerequisite: item.prerequisite,
        format: item.format,
        about: item.about,
        whatToExpect: item.whatToExpect,
        imageUrl: item.imageUrl,  // Use processed image URL from Sanity
        ctaText: item.ctaText,
        order: item.order,
      }))
    : immersionsData;
    
  const activeTrainings: TrainingData[] = sanityTrainings.length > 0 
    ? sanityTrainings.map(item => ({
        _id: item._id,
        id: item._id,
        title: item.title,
        slug: item.slug,
        duration: item.duration,
        prerequisites: item.prerequisites,
        format: item.format,
        language: item.language,
        overview: item.overview,
        whatYoullLearn: item.whatYoullLearn,
        ctaText: item.ctaText,
        order: item.order,
      }))
    : trainingsData;
  
  const [isMobile, setIsMobile] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentSectionRef = useRef(currentSection);

  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 800; // ms cooldown for section changes

  /** Touch: once a horizontal drag is detected on a carousel strip, allow native overflow-x scroll */
  const touchCarouselAxisRef = useRef<'h' | 'v' | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  // Handle card expanded change - lock/unlock scrolling
  const handleCardExpandedChange = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded);
    // Scroll is already locked via body.style.overflow = 'hidden' for this page
  }, []);

  // Handle opening booking modal
  const handleOpenBookingModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  // Scroll a carousel by one card width in either direction
  const scrollCarousel = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: 'prev' | 'next') => {
    const el = ref.current;
    if (!el) return;
    const cardWidth = el.querySelector('.carousel-card')?.clientWidth ?? el.clientWidth * 0.6;
    el.scrollBy({ left: direction === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
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
        
        // Reset native horizontal scroll when entering a carousel section
        const section = SECTIONS[index];
        if (section.type === 'carousel') {
          if (section.id === 'immersions-carousel') {
            const el = immersionsCarouselScrollRef.current;
            if (el) {
              el.scrollLeft = direction === 'down' ? 0 : Math.max(0, el.scrollWidth - el.clientWidth);
            }
          } else if (section.id === 'trainings-carousel') {
            const el = trainingsCarouselScrollRef.current;
            if (el) {
              el.scrollLeft = direction === 'down' ? 0 : Math.max(0, el.scrollWidth - el.clientWidth);
            }
          }
        }
        
        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, setTheme]);

  // Handle scroll to target section from query parameter
  useEffect(() => {
    if (!isReady || hasScrolledToTarget) return;
    
    const scrollTo = searchParams.get('scrollTo');
    if (!scrollTo) return;

    // Find the target section index
    let targetIndex = -1;
    if (scrollTo === 'immersions') {
      targetIndex = SECTIONS.findIndex(s => s.id === 'immersions-carousel');
    } else if (scrollTo === 'trainings') {
      targetIndex = SECTIONS.findIndex(s => s.id === 'trainings-carousel');
    }

    if (targetIndex !== -1 && targetIndex !== currentSection) {
      // Wait a bit for layout to settle, then scroll
      const scrollTimeout = setTimeout(() => {
        goToSection(targetIndex, 'down');
        setHasScrolledToTarget(true);
      }, 500);

      return () => clearTimeout(scrollTimeout);
    }
  }, [isReady, hasScrolledToTarget, searchParams, currentSection, goToSection]);

  // Handle scroll input (vertical only — carousels use native horizontal overflow)
  const handleScroll = useCallback((deltaY: number) => {
    if (isCardExpanded || isAnimating) return;
    if (deltaY === 0) return;

    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
    lastScrollTimeRef.current = now;

    if (deltaY > 0) {
      goToSection(currentSection + 1, 'down');
    } else {
      goToSection(currentSection - 1, 'up');
    }
  }, [isCardExpanded, isAnimating, currentSection, goToSection]);

  // Setup GSAP Observer for scroll/touch handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    // Lock scroll for this page (GSAP takes over)
    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      if (isCardExpanded) return;
      e.preventDefault();

      const idx = currentSectionRef.current;
      const section = SECTIONS[idx];
      // Route horizontal trackpad swipes to the carousel strip
      if (section?.type === 'carousel' && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        const el =
          section.id === 'immersions-carousel'
            ? immersionsCarouselScrollRef.current
            : trainingsCarouselScrollRef.current;
        if (el) el.scrollLeft += e.deltaX;
        return;
      }

      handleScroll(e.deltaY);
    };

    // Touch: vertical pans drive section changes; horizontal pans on carousel strips use native scroll
    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      lastTouchY = t.clientY;
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      touchCarouselAxisRef.current = null;
    };

    const getActiveCarouselScrollEl = (): HTMLElement | null => {
      const idx = currentSectionRef.current;
      const section = SECTIONS[idx];
      if (section?.type !== 'carousel') return null;
      return section.id === 'immersions-carousel'
        ? immersionsCarouselScrollRef.current
        : trainingsCarouselScrollRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isCardExpanded) return;

      const touch = e.touches[0];
      const scrollEl = getActiveCarouselScrollEl();
      const target = e.target as Node | null;

      if (scrollEl && target && scrollEl.contains(target)) {
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;

        if (touchCarouselAxisRef.current === null) {
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            return;
          }
          touchCarouselAxisRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        }

        if (touchCarouselAxisRef.current === 'h') {
          return;
        }
      }

      e.preventDefault();
      const currentY = touch.clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;
      handleScroll(deltaY * 2);
    };

    const handleTouchEnd = () => {
      touchCarouselAxisRef.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
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
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#6a3f33]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                Gather, Learn, Transform Together
              </h2>
              <div
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center text-[#6a3f33] px-2"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p className="mb-4 text-left" >
                  Healing deepens when experienced in community. Whether you&apos;re exploring a theme that
                  resonates with your journey, or stepping into the role of healer yourself, our immersions
                  & trainings create sacred containers for collective transformation.
                </p>
                <p className="mb-4 text-left" >
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

            <div className="relative z-10 mx-auto flex max-w-full flex-col items-center sm:max-w-[calc(100vw-64px)] lg:max-w-[1000px]">
              {/* Mobile: Cluster images at top */}
              {isMobile && (
                <div className="relative w-full max-w-[313px] mx-auto mb-8 aspect-[313/280]">
                <div className="absolute top-0 left-0 w-[48.3%] h-[45%]">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/immersions/immersion_1')}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 40vw, 120px"
                    quality={85}
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <div className="absolute top-[21.4%] left-[47.3%] w-[55.8%] h-[42.1%]">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/immersions/immersion_2')}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 35vw, 112px"
                    quality={85}
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <div className="absolute top-[46.4%] left-[1.9%] w-[66.6%] h-[54.6%]">
                  <Image
                    src={getCloudinaryUrl('antarpravaah/immersions/immersion_3')}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 45vw, 146px"
                    quality={85}
                    loading="lazy"
                    className="object-contain"
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
                    className="hidden md:block text-[14px] sm:text-[16px] lg:text-[24px] leading-normal"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    Transformative Gatherings
                  </h3>
                  <div
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-3 text-left">
                      Immersions at Antar Pravaah focus on meaningful themes without delving deeply into personal
                      histories. These gatherings create space for broader awareness.
                    </p>
                    <p className="mb-3 text-left">
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
                    <span className="block">Upcoming Immersions & Workshops</span>
                  </>
                ) : (
                  'Upcoming Immersions & Workshops'
                )}
              </div>
              {/* Nav buttons — desktop only */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => scrollCarousel(immersionsCarouselScrollRef, 'prev')}
                  className="text-[#d58761] opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Previous"
                >
                  <svg width="23" height="20" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z" fill="currentColor"/>
                    <path d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  onClick={() => scrollCarousel(immersionsCarouselScrollRef, 'next')}
                  className="text-[#d58761] opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Next"
                >
                  <svg width="23" height="20" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.69019 9.10567C2.68288 9.10558 2.67611 9.10574 2.66866 9.10526C2.64795 9.10457 2.62575 9.10222 2.60966 9.0899C2.57463 9.06362 2.58486 9.01034 2.59955 8.96862C2.75564 8.52544 3.05753 8.18017 3.3305 7.79866C3.60348 7.41714 3.86931 7.01367 4.0848 6.59226C4.4115 5.95438 4.76304 5.00818 4.683 4.30464C4.58386 3.42752 4.04831 2.58576 3.52743 1.89555C3.39042 1.71389 2.52974 0.922658 2.56292 0.73448C2.61044 0.464118 3.46981 1.05424 3.60385 1.13789C5.1795 2.11502 6.35612 3.57618 5.84566 5.50449C5.82333 5.58856 5.79992 5.67214 5.77461 5.7555C5.63391 6.22345 5.45951 6.69259 5.13169 7.07999C4.84308 7.42154 4.53417 7.74786 4.20756 8.05588C3.9726 8.27765 3.72818 8.49047 3.47551 8.69263C3.24182 8.87993 3.01363 9.10285 2.68978 9.1045L2.69019 9.10567Z" fill="currentColor"/>
                    <path d="M7.87036 9.10567C7.86305 9.10558 7.85628 9.10574 7.84884 9.10526C7.82812 9.10457 7.80592 9.10222 7.78983 9.0899C7.75481 9.06362 7.76504 9.01034 7.77972 8.96862C7.93582 8.52544 8.23771 8.18017 8.51068 7.79866C8.78365 7.41714 9.04948 7.01367 9.26498 6.59226C9.59168 5.95438 9.94321 5.00818 9.86317 4.30464C9.76403 3.42752 9.22849 2.58576 8.70761 1.89555C8.5706 1.71389 7.70991 0.922658 7.7431 0.73448C7.79062 0.464118 8.64998 1.05424 8.78402 1.13789C10.3597 2.11502 11.5363 3.57618 11.0258 5.50449C11.0035 5.58856 10.9801 5.67214 10.9548 5.7555C10.8141 6.22345 10.6397 6.69259 10.3119 7.07999C10.0233 7.42154 9.71435 7.74786 9.38774 8.05588C9.15278 8.27765 8.90835 8.49047 8.65569 8.69263C8.422 8.87993 8.19381 9.10285 7.86996 9.1045L7.87036 9.10567Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel — native horizontal scroll; vertical wheel/touch changes section */}
            <div className="flex-1 flex min-h-0 items-stretch">
              <div
                ref={immersionsCarouselScrollRef}
                className="no-scrollbar min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain py-4 pl-4 pr-4 touch-pan-x sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
              >
                <div className="flex h-full min-h-0 gap-4 sm:gap-5 lg:gap-6">
                {activeImmersions.map((immersion) => (
                  <div
                    key={immersion._id || immersion.id}
                    className="carousel-card shrink-0 snap-center h-full"
                    style={{ width: isMobile ? 'calc(100vw - 32px)' : desktopCardWidth }}
                  >
                    <ImmersionCard
                      data={immersion}
                      isMobile={isMobile}
                      onExpandedChange={handleCardExpandedChange}
                      onBookingClick={handleOpenBookingModal}
                    />
                  </div>
                ))}
                </div>
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
                <div className="relative w-full max-w-[313px] mx-auto mb-8 aspect-[313/280] transform rotate-180">
                  <div className="absolute top-0 left-0 w-[48.3%] h-[45%] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_1')}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 40vw, 120px"
                      quality={85}
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-[21.4%] left-[47.3%] w-[55.8%] h-[42.1%] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_2')}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 35vw, 112px"
                      quality={85}
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-[46.4%] left-[1.9%] w-[66.6%] h-[54.6%] transform rotate-180">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/trainings/training_3')}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 45vw, 146px"
                      quality={85}
                      loading="lazy"
                      className="object-contain"
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
                    className="text-[14px] sm:text-[15px] lg:text-[24px] leading-[24px] md:leading-normal"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400}}
                  >
                    Become Your Own Healer
                  </h3>
                  <div
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-justify md:text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    <p className="mb-3 text-left">
                      Our training programs offer more than certification—they offer transformation. As you learn to facilitate healing for others, you become your own most skilled healer.
                    </p>
                    <p className="mb-3 text-left">
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
              {/* Nav buttons — desktop only */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => scrollCarousel(trainingsCarouselScrollRef, 'prev')}
                  className="text-[#d58761] opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Previous"
                >
                  <svg width="23" height="20" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.67036 9.10567C9.67767 9.10558 9.68444 9.10574 9.69189 9.10526C9.7126 9.10457 9.7348 9.10222 9.75089 9.0899C9.78592 9.06362 9.77569 9.01034 9.761 8.96862C9.60491 8.52544 9.30302 8.18017 9.03005 7.79866C8.75707 7.41714 8.49124 7.01367 8.27575 6.59226C7.94905 5.95438 7.59751 5.00818 7.67755 4.30464C7.77669 3.42752 8.31224 2.58576 8.83312 1.89555C8.97013 1.71389 9.83081 0.922658 9.79763 0.73448C9.75011 0.464118 8.89074 1.05424 8.7567 1.13789C7.18104 2.11502 6.00442 3.57618 6.51489 5.50449C6.53722 5.58856 6.56063 5.67214 6.58594 5.7555C6.72663 6.22345 6.90104 6.69259 7.22886 7.07999C7.51747 7.42154 7.82638 7.74786 8.15299 8.05588C8.38795 8.27765 8.63237 8.49047 8.88504 8.69263C9.11873 8.87993 9.34692 9.10285 9.67077 9.1045L9.67036 9.10567Z" fill="currentColor"/>
                    <path d="M4.49019 9.10567C4.4975 9.10558 4.50427 9.10574 4.51171 9.10526C4.53242 9.10457 4.55463 9.10222 4.57072 9.0899C4.60574 9.06362 4.59551 9.01034 4.58082 8.96862C4.42473 8.52544 4.12284 8.18017 3.84987 7.79866C3.5769 7.41714 3.31107 7.01367 3.09557 6.59226C2.76887 5.95438 2.41734 5.00818 2.49738 4.30464C2.59652 3.42752 3.13206 2.58576 3.65294 1.89555C3.78995 1.71389 4.65063 0.922658 4.61745 0.73448C4.56993 0.464118 3.71057 1.05424 3.57653 1.13789C2.00087 2.11502 0.824249 3.57618 1.33472 5.50449C1.35705 5.58856 1.38046 5.67214 1.40577 5.7555C1.54646 6.22345 1.72087 6.69259 2.04868 7.07999C2.3373 7.42154 2.6462 7.74786 2.97281 8.05588C3.20777 8.27765 3.45219 8.49047 3.70486 8.69263C3.93855 8.87993 4.16674 9.10285 4.49059 9.1045L4.49019 9.10567Z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                  onClick={() => scrollCarousel(trainingsCarouselScrollRef, 'next')}
                  className="text-[#d58761] opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Next"
                >
                  <svg width="23" height="20" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.69019 9.10567C2.68288 9.10558 2.67611 9.10574 2.66866 9.10526C2.64795 9.10457 2.62575 9.10222 2.60966 9.0899C2.57463 9.06362 2.58486 9.01034 2.59955 8.96862C2.75564 8.52544 3.05753 8.18017 3.3305 7.79866C3.60348 7.41714 3.86931 7.01367 4.0848 6.59226C4.4115 5.95438 4.76304 5.00818 4.683 4.30464C4.58386 3.42752 4.04831 2.58576 3.52743 1.89555C3.39042 1.71389 2.52974 0.922658 2.56292 0.73448C2.61044 0.464118 3.46981 1.05424 3.60385 1.13789C5.1795 2.11502 6.35612 3.57618 5.84566 5.50449C5.82333 5.58856 5.79992 5.67214 5.77461 5.7555C5.63391 6.22345 5.45951 6.69259 5.13169 7.07999C4.84308 7.42154 4.53417 7.74786 4.20756 8.05588C3.9726 8.27765 3.72818 8.49047 3.47551 8.69263C3.24182 8.87993 3.01363 9.10285 2.68978 9.1045L2.69019 9.10567Z" fill="currentColor"/>
                    <path d="M7.87036 9.10567C7.86305 9.10558 7.85628 9.10574 7.84884 9.10526C7.82812 9.10457 7.80592 9.10222 7.78983 9.0899C7.75481 9.06362 7.76504 9.01034 7.77972 8.96862C7.93582 8.52544 8.23771 8.18017 8.51068 7.79866C8.78365 7.41714 9.04948 7.01367 9.26498 6.59226C9.59168 5.95438 9.94321 5.00818 9.86317 4.30464C9.76403 3.42752 9.22849 2.58576 8.70761 1.89555C8.5706 1.71389 7.70991 0.922658 7.7431 0.73448C7.79062 0.464118 8.64998 1.05424 8.78402 1.13789C10.3597 2.11502 11.5363 3.57618 11.0258 5.50449C11.0035 5.58856 10.9801 5.67214 10.9548 5.7555C10.8141 6.22345 10.6397 6.69259 10.3119 7.07999C10.0233 7.42154 9.71435 7.74786 9.38774 8.05588C9.15278 8.27765 8.90835 8.49047 8.65569 8.69263C8.422 8.87993 8.19381 9.10285 7.86996 9.1045L7.87036 9.10567Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel — native horizontal scroll; vertical wheel/touch changes section */}
            <div className="flex-1 flex min-h-0 items-stretch">
              <div
                ref={trainingsCarouselScrollRef}
                className="no-scrollbar min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain py-4 pl-4 pr-4 touch-pan-x sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
              >
                <div className="flex h-full min-h-0 gap-4 sm:gap-5 lg:gap-6">
                {activeTrainings.map((training) => (
                  <div
                    key={training._id || training.id}
                    className="carousel-card shrink-0 snap-center h-full"
                    style={{ width: isMobile ? 'calc(100vw - 32px)' : desktopCardWidth }}
                  >
                    <TrainingCard
                      data={training}
                      isMobile={isMobile}
                      onExpandedChange={handleCardExpandedChange}
                      onBookingClick={handleOpenBookingModal}
                    />
                  </div>
                ))}
                </div>
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
                <Button
                  text="Explore Upcoming Immersions"
                  size="medium"
                  onClick={() => goToSection(2, 'down')}
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
                <Button
                  text="View Training Programs"
                  size="medium"
                  onClick={() => goToSection(4, 'down')}
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
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

      {/* Guided Journey Modal */}
      <GuidedJourneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startAt="booking-calendar"
      />
    </>
  );
}

// Main page component with Suspense boundary
export default function ImmersionsPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#f6edd0]" />}>
      <ImmersionsPageContent />
    </Suspense>
  );
}
