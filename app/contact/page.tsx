'use client';

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import Button from '@/components/Button';
import FaqItem from '@/components/FaqItem';
import PageEndBlob from '@/components/PageEndBlob';
import Footer from '@/components/Footer';
import GuidedJourneyModal from '@/components/GuidedJourneyModal';
import { faqSections } from '@/data/faqContent';
import { useThemeStore } from '@/lib/stores/useThemeStore';
import { SectionId } from '@/lib/themeConfig';

// Contact page button colors
const contactButtonColors = {
  fg: '#494e3c',
  fgHover: '#96a37c',
  bgHover: '#494e3c',
};

// Button colors for the green card section
const cardButtonColors = {
  fg: '#474e3a',
  fgHover: '#93a378',
  bgHover: '#474e3a',
};

// Section configuration
const SECTIONS: { id: string; type: 'static' | 'faq-scroll' | 'footer'; themeId: SectionId }[] = [
  { id: 'contact-intro', type: 'static', themeId: 'contact' },
  { id: 'contact-info', type: 'static', themeId: 'contact-info' },
  { id: 'contact-faq', type: 'faq-scroll', themeId: 'faq' },
  { id: 'contact-footer', type: 'footer', themeId: 'contact-footer' },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const faqScrollRef = useRef<HTMLDivElement>(null);

  const setTheme = useThemeStore((state) => state.setTheme);

  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFaqScrollActive, setIsFaqScrollActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [expandedFaq, setExpandedFaq] = useState<string | null>('0-0');

  const lastScrollTimeRef = useRef<number>(0);
  const sectionScrollCooldown = 800;

  // Initialize and check mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setTheme(SECTIONS[0].themeId);

    const readyTimeout = setTimeout(() => setIsReady(true), 100);

    return () => {
      clearTimeout(readyTimeout);
    };
  }, [setTheme]);

  // Handle mobile viewport height
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setViewportHeight = () => {
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

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 'up' | 'down' = 'down') => {
    if (isAnimating) return;
    if (index < 0 || index >= SECTIONS.length) return;

    const container = containerRef.current;
    const targetSection = sectionsRef.current[index];
    if (!container || !targetSection) return;

    setIsAnimating(true);
    setIsFaqScrollActive(false);

    setTheme(SECTIONS[index].themeId);

    const targetY = -targetSection.offsetTop;

    gsap.to(container, {
      y: targetY,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection(index);

        const section = SECTIONS[index];

        if (section.type === 'faq-scroll') {
          // Reset FAQ scroll position based on direction
          if (faqScrollRef.current) {
            if (direction === 'down') {
              faqScrollRef.current.scrollTop = 0;
            } else {
              faqScrollRef.current.scrollTop = faqScrollRef.current.scrollHeight;
            }
          }
          setTimeout(() => setIsFaqScrollActive(true), 400);
        }

        lastScrollTimeRef.current = Date.now();
        setIsAnimating(false);
      },
    });
  }, [isAnimating, setTheme]);

  // Handle FAQ scroll edge reached
  const handleFaqEdgeReached = useCallback((edge: 'start' | 'end') => {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;

    setIsFaqScrollActive(false);

    if (edge === 'end') {
      goToSection(currentSection + 1, 'down');
    } else if (edge === 'start') {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, goToSection]);

  // Handle scroll input
  const handleScroll = useCallback((deltaY: number) => {
    if (isAnimating) return;

    const section = SECTIONS[currentSection];

    // If FAQ scroll section is active, handle internal scrolling
    if (section.type === 'faq-scroll' && isFaqScrollActive) {
      const faqEl = faqScrollRef.current;
      if (!faqEl) return;

      const isScrollingDown = deltaY > 0;
      const tolerance = 2;
      const atTop = faqEl.scrollTop <= tolerance;
      const atBottom = faqEl.scrollTop + faqEl.clientHeight >= faqEl.scrollHeight - tolerance;

      if (isScrollingDown && atBottom) {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
        handleFaqEdgeReached('end');
      } else if (!isScrollingDown && atTop) {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
        handleFaqEdgeReached('start');
      } else {
        // Scroll inside FAQ container
        faqEl.scrollTop += deltaY;
      }
      return;
    }

    // Static/footer sections - change sections with cooldown
    const isScrollingDown = deltaY > 0;
    const now = Date.now();
    if (now - lastScrollTimeRef.current < sectionScrollCooldown) return;
    lastScrollTimeRef.current = now;

    if (isScrollingDown) {
      goToSection(currentSection + 1, 'down');
    } else {
      goToSection(currentSection - 1, 'up');
    }
  }, [isAnimating, currentSection, isFaqScrollActive, handleFaqEdgeReached, goToSection]);

  // Setup wheel/touch event handlers
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isReady) return;

    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
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
  }, [isReady, handleScroll]);

  const sectionClass = 'section-height';

  return (
    <>
      <style jsx global>{`
        :root {
          --header-height: 90px;
          --vh: 1vh;
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

        .section-height {
          height: calc(100vh - var(--header-height, 90px));
          min-height: calc(100vh - var(--header-height, 90px));
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
          min-height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }

        @supports (height: 100dvh) {
          .section-height {
            height: calc(100dvh - var(--header-height, 90px));
            min-height: calc(100dvh - var(--header-height, 90px));
          }
        }

        .main-container {
          position: fixed;
          top: var(--header-height, 90px);
          left: 0;
          right: 0;
          bottom: 0;
          height: calc(100vh - var(--header-height, 90px));
          height: calc(var(--vh, 1vh) * 100 - var(--header-height, 90px));
        }

        @supports (height: 100dvh) {
          .main-container {
            height: calc(100dvh - var(--header-height, 90px));
          }
        }

        /* Hide scrollbar for FAQ scroll container */
        .faq-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .faq-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hide scrollbar for contact card on mobile */
        .contact-card-scroll::-webkit-scrollbar {
          display: none;
        }
        .contact-card-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <main className="main-container overflow-hidden bg-[#f6edd0] z-[30]">
        <div ref={containerRef} className="will-change-transform">

          {/* ===== Section 1: Introduction ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[0] = el; }}
            className={`relative flex flex-col items-center justify-center px-5 sm:px-8 lg:px-8 bg-[#f6edd0] ${sectionClass}`}
          >
            <div className="max-w-[800px] mx-auto text-center flex flex-col gap-5">
              <h1
                className="text-[36px] sm:text-[42px] lg:text-[48px] leading-normal text-[#474e3a]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                We&apos;re here to support your journey
              </h1>
              <p
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#474e3a"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                Whether you have questions about our approach, need guidance choosing the right therapy,
                or want to learn more about upcoming immersions and trainings, we&apos;re here to help. Your
                healing journey begins with a conversation.
              </p>
            </div>
          </div>

          {/* ===== Section 2: Contact Info & Map ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[1] = el; }}
            className={`relative flex flex-col p-4 sm:p-6 lg:p-8 bg-[#f6edd0] overflow-hidden ${sectionClass}`}
          >
            <div className="flex-1 min-h-0 w-full max-w-[1347px] mx-auto flex flex-col">
              <div className="flex-1 min-h-0 rounded-[20px] sm:rounded-[24px] overflow-hidden flex flex-col lg:flex-row bg-[#93a378] lg:gap-10">
                {/* Scrollable content area - ensures card fits viewport on mobile */}
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col lg:flex-row lg:overflow-visible lg:gap-10 p-5 sm:p-6 lg:p-10 contact-card-scroll">
                  {/* Contact Information */}
                  <div className="flex-1 flex flex-col gap-3 sm:gap-4 lg:p-5 shrink-0 lg:shrink">
                  <div className="mb-1">
                    <p
                      className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#474e3a]"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                    >
                      Get In Touch
                    </p>
                  </div>

                  <h2
                    className="text-[28px] sm:text-[32px] lg:text-[36px] leading-normal text-[#474e3a] mb-1 sm:mb-2"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Antar Pravaah
                  </h2>

                  {/* Address */}
                  <div
                    className="text-[#474e3a]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                  >
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Address</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 400 }}>Chittaranjan Park,</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>New Delhi, India</p>
                  </div>

                  {/* Phone */}
                  <div
                    className="text-[#474e3a]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                  >
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Contact Number</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>+91 98107 10036</p>
                  </div>

                  {/* Email */}
                  <div
                    className="text-[#474e3a]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                  >
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0" style={{ fontWeight: 500 }}>Email</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]" style={{ fontWeight: 400 }}>hello@antarpravaah.com</p>
                  </div>

                  {/* Hours - Monday to Friday */}
                  <div
                    className="text-[#474e3a]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0">Monday - Friday</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]">10:00 AM - 7:00 PM</p>
                  </div>

                  {/* Hours - Saturday */}
                  <div
                    className="text-[#474e3a]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] mb-0">Saturday</p>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px]">10:00 AM - 5:00 PM</p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4 sm:mt-6 lg:mt-auto pt-2 sm:pt-4 flex justify-center lg:justify-start">
                    <Button
                      text="Schedule a Free Consultation"
                      size="medium"
                      colors={cardButtonColors}
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="flex-1 mt-6 lg:mt-0 h-[180px] sm:h-[240px] lg:min-h-[500px] lg:h-auto shrink-0 rounded-[12px] sm:rounded-[16px] lg:rounded-[24px] overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14022.234567890123!2d77.2500!3d28.5355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e564c2e5e5%3A0x1234567890abcdef!2sChittaranjan%20Park%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Antar Pravaah Location - Chittaranjan Park, New Delhi"
                  />
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 3: FAQ (Pinned Title + Scrollable Content) ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[2] = el; }}
            className={`relative flex flex-col bg-[#f6edd0] overflow-hidden ${sectionClass}`}
          >
            {/* Pinned FAQ Header */}
            <div className="shrink-0 w-full px-5 sm:px-8 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-5 lg:pb-6 bg-[#f6edd0] z-10">
              <div className="max-w-[840px] mx-auto text-center flex flex-col gap-3 sm:gap-4 lg:gap-5">
                <h2
                  className="text-[36px] sm:text-[42px] lg:text-[48px] leading-normal text-[#474e3a]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  Frequently Asked Questions
                </h2>
                <div
                  className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-[#474e3a]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                >
                  <p className="mb-2">Here are answers to the questions we hear most often.</p>
                  <p>If you don&apos;t find what you&apos;re looking for, please reach out—we&apos;re happy to help.</p>
                </div>
              </div>
            </div>

            {/* Scrollable FAQ Content */}
            <div
              ref={faqScrollRef}
              className="flex-1 overflow-y-auto faq-scroll-container px-5 sm:px-8 pb-8"
            >
              <div className="max-w-[637px] mx-auto flex flex-col gap-6 sm:gap-8 lg:gap-10">
                {faqSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="flex flex-col items-start w-full">
                    {/* Section Header */}
                    <div className="w-full text-center py-3 sm:py-4">
                      <h3
                        className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#96a37c]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                      > 
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Separator */}
                    <div className="w-full flex items-center justify-center py-3 sm:py-4 lg:py-5">
                      <img
                        src="/section_separator.svg"
                        alt=""
                        className="w-[34px] h-[35px]"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(65%) sepia(15%) saturate(520%) hue-rotate(50deg) brightness(92%) contrast(85%)',
                        }}
                      />
                    </div>

                    {/* FAQ Items */}
                    {section.faqs.map((faq, faqIndex) => {
                      const faqId = `${sectionIndex}-${faqIndex}`;
                      return (
                        <FaqItem
                          key={faqIndex}
                          question={faq.question}
                          answer={faq.answer}
                          isExpanded={expandedFaq === faqId}
                          onToggle={() => setExpandedFaq(expandedFaq === faqId ? null : faqId)}
                        />
                      );
                    })}

                    {/* Section End Blob */}
                    <div className="w-full flex items-center justify-center py-3 sm:py-4 lg:py-5">
                      <PageEndBlob color="#96a37c" className="w-[120px] sm:w-[140px] lg:w-[163px] h-auto opacity-60" />
                    </div>
                  </div>
                ))}

                {/* Final CTA at bottom of FAQ scroll */}
                <div className="w-full text-center flex flex-col gap-5 sm:gap-6 lg:gap-8 items-center pb-6 sm:pb-8 lg:pb-10">
                  <h2
                    className="text-[28px] sm:text-[32px] lg:text-[36px] leading-normal text-[#96a37c]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    We&apos;re here to help
                  </h2>
                  <p
                    className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-[#96a37c] max-w-[600px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    Can&apos;t find the answer you&apos;re looking for? We&apos;re happy to discuss any questions or
                    concerns you might have about your healing journey.
                  </p>
                  <div className="flex flex-col gap-3 items-center">
                    <Button text="Book your first session" size="medium" colors={contactButtonColors} onClick={() => setIsModalOpen(true)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 4: Footer ===== */}
          <div
            ref={(el) => { if (el) sectionsRef.current[3] = el; }}
            className={`relative flex items-center bg-[#474e3a] ${sectionClass}`}
          >
            <Footer />
          </div>

        </div>
      </main>
      <GuidedJourneyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
