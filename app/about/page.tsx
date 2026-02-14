'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import FadeInImage from '@/components/FadeInImage';
import AboutBlobScroll from '@/components/AboutBlobScroll';
import InspirationScroll from '@/components/InspirationScroll';
import Footer from '@/components/Footer';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Section configuration - different for mobile vs desktop
const SECTIONS_MOBILE: { id: string; type: 'static' | 'blob-scroll' | 'inspiration-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'about-intro', type: 'static', themeId: 'about-intro' },
  { id: 'about-photos-1', type: 'static', themeId: 'about-intro' },
  { id: 'about-body', type: 'blob-scroll', themeId: 'about-body' },
  { id: 'about-photos-2', type: 'static', themeId: 'about-body' },
  { id: 'inspiration', type: 'inspiration-scroll', themeId: 'inspiration' },
  { id: 'about-cta', type: 'static', themeId: 'about-cta' },
  { id: 'footer', type: 'footer', themeId: 'about-footer' },
];

const SECTIONS_DESKTOP: { id: string; type: 'static' | 'blob-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'about-intro', type: 'static', themeId: 'about-intro' },
  { id: 'about-body', type: 'blob-scroll', themeId: 'about-body' },
  { id: 'inspiration', type: 'static', themeId: 'inspiration' },
  { id: 'about-cta', type: 'static', themeId: 'about-cta' },
  { id: 'footer', type: 'footer', themeId: 'about-footer' },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setTheme = useThemeStore((state) => state.setTheme);

  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBlobScrollActive, setIsBlobScrollActive] = useState(false);
  const [isInspirationScrollActive, setIsInspirationScrollActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track scroll reset states
  const [blobResetToStart, setBlobResetToStart] = useState(false);
  const [blobResetToEnd, setBlobResetToEnd] = useState(false);
  const [inspirationResetToStart, setInspirationResetToStart] = useState(false);
  const [inspirationResetToEnd, setInspirationResetToEnd] = useState(false);

  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 800;

  // Get current sections based on viewport
  const SECTIONS = isMobile ? SECTIONS_MOBILE : SECTIONS_DESKTOP;

  // Initialize and check mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set initial theme
    setTheme(SECTIONS_DESKTOP[0].themeId);

    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(readyTimeout);
    };
  }, [setTheme]);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;

    const container = containerRef.current;
    const targetSection = sectionsRef.current[index];
    if (!container || !targetSection) return;

    setIsAnimating(true);
    setIsBlobScrollActive(false);
    setIsInspirationScrollActive(false);

    setTheme(SECTIONS[index].themeId);

    const targetY = -targetSection.offsetTop;

    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection(index);

        const section = SECTIONS[index];
        
        if (section.type === 'blob-scroll') {
          if (direction === 'down') {
            setBlobResetToStart(true);
            setTimeout(() => setBlobResetToStart(false), 100);
          } else {
            setBlobResetToEnd(true);
            setTimeout(() => setBlobResetToEnd(false), 100);
          }
          setTimeout(() => setIsBlobScrollActive(true), 400);
        } else if (section.type === 'inspiration-scroll') {
          if (direction === 'down') {
            setInspirationResetToStart(true);
            setTimeout(() => setInspirationResetToStart(false), 100);
          } else {
            setInspirationResetToEnd(true);
            setTimeout(() => setInspirationResetToEnd(false), 100);
          }
          setTimeout(() => setIsInspirationScrollActive(true), 400);
        }

        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, SECTIONS, setTheme]);

  // Handle blob scroll edge reached
  const handleBlobEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsBlobScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle inspiration scroll edge reached
  const handleInspirationEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsInspirationScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle paragraph change in blob scroll (desktop only)
  const handleParagraphChange = useCallback((paragraphIndex: number) => {
    if (isMobile) return; // Only sync on desktop
    
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (images.length === 0) return;

    // Map paragraph index to image index
    // Paragraph 0 -> Image 0 (first image already visible)
    // Paragraph 1 -> Image 1
    // Paragraph 2 -> Image 2
    // Paragraph 3 -> Image 3
    // Paragraph 4 -> Image 4
    // We have 6 images total, so paragraph 4 can reveal both image 4 and 5
    
    if (paragraphIndex === 0) {
      // First paragraph - show first image
      gsap.to(images[0], { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
    } else if (paragraphIndex === 1) {
      // Second paragraph - show second image
      gsap.to(images[1], { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
    } else if (paragraphIndex === 2) {
      // Third paragraph - show third and fourth images
      gsap.to([images[2], images[3]], { autoAlpha: 1, duration: 0.5, ease: 'power2.out', stagger: 0.15 });
    } else if (paragraphIndex === 3) {
      // Fourth paragraph - show fifth image
      gsap.to(images[4], { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
    } else if (paragraphIndex === 4) {
      // Fifth paragraph - show sixth image
      gsap.to(images[5], { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [isMobile]);

  // Handle scroll input
  const handleScroll = useCallback((deltaY: number) => {
    if (isAnimating) return;

    const section = SECTIONS[currentSection];
    
    if (section.type === 'blob-scroll' && isBlobScrollActive) return;
    if (section.type === 'inspiration-scroll' && isInspirationScrollActive) return;

    const isScrollingDown = deltaY > 0;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
    lastScrollTimeRef.current = now;

    if (isScrollingDown) {
      goToSection(currentSection + 1, 'down');
    } else {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, SECTIONS, isBlobScrollActive, isInspirationScrollActive, goToSection]);

  // Handle mobile viewport height (accounts for browser toolbar)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setViewportHeight = () => {
      // Get the actual viewport height accounting for mobile browser toolbars
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  // Initialize images on desktop - hide all except first
  useEffect(() => {
    if (isMobile) return; // Only on desktop
    
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (images.length === 0) return;

    // Set initial state: first image visible, rest hidden
    gsap.set(images[0], { autoAlpha: 1 });
    gsap.set(images.slice(1), { autoAlpha: 0 });
  }, [isMobile, isReady]);

  // Handle blob reset states for images
  useEffect(() => {
    if (isMobile) return;
    if (!blobResetToStart && !blobResetToEnd) return;

    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (images.length === 0) return;

    if (blobResetToStart) {
      // Reset to start: only first image visible
      gsap.set(images[0], { autoAlpha: 1 });
      gsap.set(images.slice(1), { autoAlpha: 0 });
    } else if (blobResetToEnd) {
      // Reset to end: all images visible
      gsap.set(images, { autoAlpha: 1 });
    }
  }, [blobResetToStart, blobResetToEnd, isMobile]);

  // Setup wheel/touch event handlers
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      const section = SECTIONS[currentSection];
      if ((section.type === 'blob-scroll' && isBlobScrollActive) ||
          (section.type === 'inspiration-scroll' && isInspirationScrollActive)) {
        return;
      }
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const section = SECTIONS[currentSection];
      if ((section.type === 'blob-scroll' && isBlobScrollActive) ||
          (section.type === 'inspiration-scroll' && isInspirationScrollActive)) {
        return;
      }
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;
      handleScroll(deltaY * 2);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isReady, currentSection, SECTIONS, isBlobScrollActive, isInspirationScrollActive, handleScroll]);

  // Section height class name - uses CSS with proper fallbacks
  const sectionClass = "section-height";

  return (
    <>
      <style jsx global>{`
        :root {
          --header-height: 90px;
          --vh: 1vh; /* Fallback, will be set by JS */
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
        
        /* Section height classes that work across all mobile browsers */
        .section-height {
          /* Fallback for older browsers */
          height: calc(100vh - var(--header-height, 90px));
          min-height: calc(100vh - var(--header-height, 90px));
          /* JS-calculated height (most reliable for mobile) */
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
          min-height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }
        
        /* Use dvh where supported (modern browsers) */
        @supports (height: 100dvh) {
          .section-height {
            height: calc(100dvh - var(--header-height, 90px));
            min-height: calc(100dvh - var(--header-height, 90px));
          }
        }
        
        /* Main container positioning */
        .main-container {
          position: fixed;
          top: var(--header-height, 90px);
          left: 0;
          right: 0;
          bottom: 0;
          /* Fallback */
          height: calc(100vh - var(--header-height, 90px));
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }
        
        @supports (height: 100dvh) {
          .main-container {
            height: calc(100dvh - var(--header-height, 90px));
          }
        }
      `}</style>

      <main className="main-container overflow-hidden bg-[#f6edd0] z-[30]">
        <div ref={containerRef} className="will-change-transform">
          
          {/* ===== MOBILE LAYOUT ===== */}
          {isMobile ? (
            <>
              {/* Section 1: Introduction */}
              <div
                ref={(el) => { if (el) sectionsRef.current[0] = el; }}
                className={`relative flex flex-col items-center justify-center px-5 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="flex flex-col items-center gap-10">
                  <div className="w-[127px] h-[107px]">
                    <img src="/about_splash_vector.svg" alt="" className="w-full h-full object-contain" />
                  </div>
                  <h1
                    className="text-[24px] leading-[1.0] text-[#93a378] text-center"
                    style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                  >
                    About Namita
                  </h1>
                  <p
                    className="text-[16px] leading-[24px] text-[#474e3a] text-center"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    Founder of Antar Pravaah | Healer &amp; Facilitator | Host at Aalayam, Himachal Pradesh
                  </p>
                </div>
              </div>

              {/* Section 2: Photo Cluster 1 */}
              <div
                ref={(el) => { if (el) sectionsRef.current[1] = el; }}
                className={`relative flex items-center justify-center px-5 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="relative w-[353px] h-[320px]">
                  {/* Bottom left */}
                  <div className="absolute left-0 bottom-0 h-[152px] w-[146px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_one')} 
                      alt="Namita" 
                      width={146} height={152}
                      className="h-full w-full object-cover"
                      delayMs={200}
                    />
                  </div>
                  {/* Top center */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[221px] w-[212px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_two')} 
                      alt="Namita" 
                      width={212} height={221}
                      className="h-full w-full object-cover"
                      delayMs={400}
                    />
                  </div>
                  {/* Bottom right */}
                  <div className="absolute right-0 bottom-[15px] h-[123px] w-[117px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_three')} 
                      alt="Namita" 
                      width={117} height={123}
                      className="h-full w-full object-cover"
                      delayMs={600}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Blob with paragraphs */}
              <div
                ref={(el) => { if (el) sectionsRef.current[2] = el; }}
                className={`relative flex items-center justify-center bg-[#474e3a] overflow-hidden ${sectionClass}`}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                  <img src="/about_dashed_background.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <AboutBlobScroll
                  isActive={isBlobScrollActive}
                  onEdgeReached={handleBlobEdgeReached}
                  resetToStart={blobResetToStart}
                  resetToEnd={blobResetToEnd}
                />
              </div>

              {/* Section 4: Photo Cluster 2 */}
              <div
                ref={(el) => { if (el) sectionsRef.current[3] = el; }}
                className={`relative flex items-center justify-center px-5 bg-[#474e3a] ${sectionClass}`}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
                  <img src="/about_dashed_background.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="relative w-[300px] h-[320px] z-10">
                  {/* Top left */}
                  <div className="absolute left-[11px] top-[38px] h-[130px] w-[124px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_four')} 
                      alt="Namita" 
                      width={124} height={130}
                      className="h-full w-full object-cover"
                      delayMs={200}
                    />
                  </div>
                  {/* Bottom center */}
                  <div className="absolute left-[64px] bottom-0 h-[203px] w-[194px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_five')} 
                      alt="Namita" 
                      width={194} height={203}
                      className="h-full w-full object-cover"
                      delayMs={400}
                    />
                  </div>
                  {/* Top right */}
                  <div className="absolute right-[10px] top-0 h-[159px] w-[152px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_six')} 
                      alt="Namita" 
                      width={152} height={159}
                      className="h-full w-full object-cover"
                      delayMs={600}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: My Inspiration (scrollable) */}
              <div
                ref={(el) => { if (el) sectionsRef.current[4] = el; }}
                className={`relative flex items-center justify-center px-5 py-10 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="w-full h-[560px]">
                  <InspirationScroll
                    isActive={isInspirationScrollActive}
                    onEdgeReached={handleInspirationEdgeReached}
                    resetToStart={inspirationResetToStart}
                    resetToEnd={inspirationResetToEnd}
                  />
                </div>
              </div>

              {/* Section 6: CTA */}
              <div
                ref={(el) => { if (el) sectionsRef.current[5] = el; }}
                className={`relative flex flex-col items-center justify-center px-5 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="py-5">
                    <PageEndBlob color="#474e3a" className="h-10 w-auto opacity-60" />
                  </div>
                  <p
                    className="text-[36px] leading-[1.0] text-[#93a378] text-center"
                    style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                  >
                    Whatever you carry, you&apos;re not alone.
                  </p>
                  <Button
                    text="Begin Your Journey"
                    size="large"
                    colors={{ fg: '#474e3a', fgHover: '#93a378', bgHover: '#474e3a' }}
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </div>

              {/* Section 7: Footer */}
              <div
                ref={(el) => { if (el) sectionsRef.current[6] = el; }}
                className={`relative flex items-center bg-[#474e3a] ${sectionClass}`}
              >
                <Footer />
              </div>
            </>
          ) : (
            /* ===== DESKTOP LAYOUT ===== */
            <>
              {/* Section 1: Introduction */}
              <div
                ref={(el) => { if (el) sectionsRef.current[0] = el; }}
                className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px]">
                  <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-8 lg:py-10">
                    <div className="w-[30%] lg:w-[241px] max-w-[241px]">
                      <img src="/about_splash_vector.svg" alt="" className="block w-full h-auto object-contain" />
                    </div>
                    <h1
                      className="text-center text-[40px] lg:text-[48px] leading-[1.0] text-[#93a378]"
                      style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                    >
                      About Namita
                    </h1>
                    <p
                      className="text-center text-[20px] lg:text-[24px] leading-[normal] text-[#474e3a] px-4 max-w-[680px]"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                    >
                      Founder of Antar Pravaah | Healer &amp; Facilitator | Host at Aalayam, Himachal Pradesh
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Photos & Blob */}
              <div
                ref={(el) => { if (el) sectionsRef.current[1] = el; }}
                className={`relative flex items-center justify-center bg-[#474e3a] overflow-hidden ${sectionClass}`}
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <img src="/about_dashed_background.svg" alt="" className="h-full w-full object-cover" />
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {/* Upper-left image */}
                  <div 
                    ref={(el) => { imageRefs.current[0] = el; }}
                    className="absolute top-[18%] left-[16%] sm:top-[20%] sm:left-[20%] lg:top-[18%] lg:left-[22%]"
                  >
                    <div className="h-[150px] w-[143px] lg:h-[200px] lg:w-[191px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_one')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Upper-right image */}
                  <div 
                    ref={(el) => { imageRefs.current[1] = el; }}
                    className="absolute top-[16%] right-[18%] sm:top-[18%] sm:right-[22%] lg:top-[16%] lg:right-[24%]"
                  >
                    <div className="h-[136px] w-[130px] lg:h-[180px] lg:w-[172px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_two')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Left-middle image */}
                  <div 
                    ref={(el) => { imageRefs.current[2] = el; }}
                    className="absolute top-[38%] left-[8%] sm:top-[40%] sm:left-[10%] lg:top-[38%] lg:left-[12%]"
                  >
                    <div className="h-[164px] w-[157px] lg:h-[218px] lg:w-[208px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_three')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Right-middle image */}
                  <div 
                    ref={(el) => { imageRefs.current[3] = el; }}
                    className="absolute top-[36%] right-[8%] sm:top-[38%] sm:right-[10%] lg:top-[36%] lg:right-[12%]"
                  >
                    <div className="h-[150px] w-[143px] lg:h-[200px] lg:w-[191px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_four')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Lower-left image */}
                  <div 
                    ref={(el) => { imageRefs.current[4] = el; }}
                    className="absolute bottom-[18%] left-[18%] sm:bottom-[20%] sm:left-[22%] lg:bottom-[18%] lg:left-[24%]"
                  >
                    <div className="h-[143px] w-[136px] lg:h-[191px] lg:w-[182px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_five')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  {/* Lower-right image */}
                  <div 
                    ref={(el) => { imageRefs.current[5] = el; }}
                    className="absolute bottom-[16%] right-[16%] sm:bottom-[18%] sm:right-[20%] lg:bottom-[16%] lg:right-[22%]"
                  >
                    <div className="h-[157px] w-[150px] lg:h-[209px] lg:w-[200px] overflow-hidden rounded-full">
                      <img src={getCloudinaryUrl('antarpravaah/about/namita_six')} alt="Namita" className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <AboutBlobScroll
                    isActive={isBlobScrollActive}
                    onEdgeReached={handleBlobEdgeReached}
                    resetToStart={blobResetToStart}
                    resetToEnd={blobResetToEnd}
                    onParagraphChange={handleParagraphChange}
                  />
                </div>
              </div>

              {/* Section 3: My Inspiration */}
              <div
                ref={(el) => { if (el) sectionsRef.current[2] = el; }}
                className={`relative flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="w-full h-[85%] sm:h-[80%] lg:h-[85%] max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-64px)] bg-[#93a378] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden ios-radius-fix px-6 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
                  <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 items-center justify-center text-[#474e3a] text-center max-w-[900px]">
                    <h2
                      className="text-[40px] lg:text-[56px] leading-[1.0]"
                      style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                    >
                      My inspiration
                    </h2>
                    <div 
                      className="text-[16px] lg:text-[18px] leading-[24px] sm:leading-[28px] lg:leading-[32px] space-y-4 sm:space-y-5 lg:space-y-6"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                    >
                      <p>
                        This work is not mine alone. I would not be here were it not for the Grace, guidance and support of my Guru and the lineage of the tradition of which I am a part.
                      </p>
                      <p>
                        <a href="http://www.rikhiapeeth.in" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80 transition-opacity">
                          http://www.rikhiapeeth.in
                        </a>
                        <br />
                        <a href="https://www.biharyoga.net/index.php" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80 transition-opacity">
                          https://www.biharyoga.net/index.php
                        </a>
                      </p>
                      <p>
                        With stalwarts like Swami Sivananda Saraswati, Swami Satyananda Saraswati, Swami Niranjananda Saraswati and Swami Satyasangananda Saraswati lighting the path, I am left only to walk in their footsteps. It changed my life. The work is theirs, I am merely the face of it.
                      </p>
                      <p>
                        My teachers whose enlightened minds, passion, zeal and spirit of seva drive me every single day to show up. Namita Unnikrishnan, Dr. BN Jha, Dr. H Bhojraj, Urmimala Deb, Ritu Kabra, Marina Toledo, Dain Heer, Gary Douglas and the countless people who walked through my door trusting me with their body, mind and soul. I am grateful. So grateful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: CTA */}
              <div
                ref={(el) => { if (el) sectionsRef.current[3] = el; }}
                className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0] ${sectionClass}`}
              >
                <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px]">
                  <div className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 py-6 sm:py-8 lg:py-10">
                    <div className="flex items-center justify-center py-3 sm:py-4 lg:py-5">
                      <PageEndBlob color="#474e3a" className="h-8 sm:h-9 lg:h-10 w-auto opacity-60" />
                    </div>
                    <p
                      className="max-w-full sm:max-w-[680px] lg:max-w-[799px] text-center text-[32px] lg:text-[36px] leading-[normal] text-[#93a378] px-4"
                      style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                    >
                      Whatever you carry, you&apos;re not alone.
                    </p>
                    <Button
                      text="Begin Your Journey"
                      size="large"
                      colors={{ fg: '#474e3a', fgHover: '#93a378', bgHover: '#474e3a' }}
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Footer */}
              <div
                ref={(el) => { if (el) sectionsRef.current[4] = el; }}
                className={`relative flex items-center bg-[#474e3a] ${sectionClass}`}
              >
                <Footer />
              </div>
            </>
          )}
        </div>
      </main>

      <GuidedJourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
