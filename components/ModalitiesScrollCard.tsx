'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';
import Button from './Button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

export interface ModalityContent {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  bestFor: {
    column1: string[];
    column2: string[];
  };
  sessionDuration: string;
  ctaText: string;
  iconSrc: string;
}

interface ModalitiesScrollCardProps {
  modalities: ModalityContent[];
  sectionTitle?: string;
  // New props for page-level coordination (like AboutBlobScroll)
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

// Button colors for therapies page
const therapiesButtonColors = {
  fg: '#645c42',
  fgHover: '#d6c68e',
  bgHover: '#645c42',
};

export default function ModalitiesScrollCard({ 
  modalities, 
  sectionTitle,
  isActive = false,
  onEdgeReached,
  resetToStart,
  resetToEnd,
}: ModalitiesScrollCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Cooldown between modality changes (prevents residual scroll)
  const scrollCooldown = 400;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reset to start (when entering from above)
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    // Reset to first modality
    activeIndexRef.current = 0;
    prevIndexRef.current = 0;
    setActiveIndex(0);
    lastScrollTimeRef.current = Date.now();
  }, [resetToStart, isClient]);

  // Handle reset to end (when entering from below)
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    // Reset to last modality
    const lastIndex = modalities.length - 1;
    activeIndexRef.current = lastIndex;
    prevIndexRef.current = lastIndex;
    setActiveIndex(lastIndex);
    lastScrollTimeRef.current = Date.now();
  }, [resetToEnd, isClient, modalities.length]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
      // Add delay before enabling to prevent residual scroll from triggering
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive]);

  // Setup Observer-based scroll handling
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;
    if (!containerRef.current || modalities.length < 2) return;

    const totalItems = modalities.length;

    const animateToIndex = (newIndex: number, callback?: () => void) => {
      if (newIndex < 0 || newIndex >= totalItems) return;
      if (isAnimatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      if (newIndex === currentIndex) return;

      isAnimatingRef.current = true;
      prevIndexRef.current = currentIndex;
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      
      // Animation happens in the useEffect below
      // Set timeout to match animation duration
      setTimeout(() => {
        isAnimatingRef.current = false;
        lastScrollTimeRef.current = Date.now();
        callback?.();
      }, 600);
    };

    const handleScroll = (direction: 'up' | 'down') => {
      // Check cooldown to prevent residual scroll
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (isAnimatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      
      if (direction === 'down') {
        if (currentIndex < totalItems - 1) {
          animateToIndex(currentIndex + 1);
        } else {
          // At the end - notify parent to move to next section
          lastScrollTimeRef.current = now;
          onEdgeReached?.('end');
        }
      } else {
        if (currentIndex > 0) {
          animateToIndex(currentIndex - 1);
        } else {
          // At the start - notify parent to move to previous section
          lastScrollTimeRef.current = now;
          onEdgeReached?.('start');
        }
      }
    };

    // Create Observer for scroll handling - starts disabled
    const modalityObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    // Start disabled, will be enabled when isActive becomes true
    modalityObserver.disable();
    observerRef.current = modalityObserver;

    return () => {
      modalityObserver.kill();
      observerRef.current = null;
    };
  }, [isClient, modalities.length, onEdgeReached]);

  // Animate content when activeIndex changes - smooth parallax effect
  useEffect(() => {
    if (!contentRef.current) return;
    
    const content = contentRef.current;
    const elements = content.querySelectorAll('.animate-content');
    const icon = content.querySelector('.animate-icon');
    
    // Determine scroll direction
    const isScrollingDown = activeIndex > prevIndexRef.current;
    const yStart = isScrollingDown ? 30 : -30;
    
    // Kill any existing animations
    gsap.killTweensOf(elements);
    if (icon) gsap.killTweensOf(icon);
    
    // Smooth parallax fade-in with staggered elements
    const tl = gsap.timeline();
    
    // Text content animates with parallax Y movement
    tl.fromTo(
      elements,
      { 
        opacity: 0,
        y: yStart,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power3.out',
      }
    );
    
    // Icon has a slightly different parallax effect - floats up more gently
    if (icon) {
      tl.fromTo(
        icon,
        { 
          opacity: 0,
          y: isScrollingDown ? 40 : -40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4' // Overlap with text animation
      );
    }
    
    return () => {
      tl.kill();
    };
  }, [activeIndex]);

  const currentModality = modalities[activeIndex];

  if (!currentModality) return null;

  return (
    <div ref={containerRef} className="modalities-scroll-container relative w-full h-full flex flex-col items-center justify-center">
      {/* Section Title */}
      {sectionTitle && (
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center w-full shrink-0">
          <h2
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {sectionTitle}
          </h2>
        </div>
      )}

      {/* Static Card Container - centered with max width */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[1200px] flex-1 max-h-[700px] bg-[#d6c68e] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden"
      >
        <div 
          ref={contentRef}
          className="h-full flex flex-col lg:flex-row p-5 sm:p-6 lg:p-8"
        >
          {/* Left side - Content */}
          <div className="flex-1 flex flex-col lg:pr-6 overflow-hidden">
            {/* Title */}
            <h3
              className="animate-content text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.1] text-[#645c42] mb-2 sm:mb-3 shrink-0"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              {currentModality.title}
            </h3>

            {/* Subtitle */}
            <p
              className="animate-content text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.3] text-[#645c42] mb-3 sm:mb-4 shrink-0"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {currentModality.subtitle}
            </p>

            {/* Description - scrollable if needed */}
            <div
              className="animate-content text-[13px] sm:text-[14px] lg:text-[15px] leading-[22px] text-[#645c42] text-justify mb-3 sm:mb-4 flex-shrink overflow-y-auto"
              style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
            >
              {currentModality.description.map((para, idx) => (
                <p key={idx} className={idx < currentModality.description.length - 1 ? 'mb-2' : ''}>
                  {para}
                </p>
              ))}
            </div>

            {/* Best For Section */}
            <div className="animate-content mb-3 sm:mb-4 shrink-0">
              <p
                className="text-[13px] sm:text-[14px] lg:text-[15px] leading-[20px] text-[#645c42] mb-1"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                Best For
              </p>
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-8">
                <ul
                  className="list-disc list-inside text-[12px] sm:text-[13px] lg:text-[14px] leading-[20px] text-[#645c42]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                >
                  {currentModality.bestFor.column1.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <ul
                  className="list-disc list-inside text-[12px] sm:text-[13px] lg:text-[14px] leading-[20px] text-[#645c42]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                >
                  {currentModality.bestFor.column2.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Session Duration */}
            <div className="animate-content mb-3 sm:mb-4 shrink-0">
              <p
                className="text-[13px] sm:text-[14px] lg:text-[15px] leading-[20px] text-[#645c42]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                Session Duration
              </p>
              <p
                className="text-[12px] sm:text-[13px] lg:text-[14px] leading-[20px] text-[#645c42]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
              >
                {currentModality.sessionDuration}
              </p>
            </div>

            {/* CTA Button - always at bottom of left column */}
            <div className="animate-content mt-auto shrink-0">
              <Button 
                text={currentModality.ctaText} 
                size="large" 
                colors={therapiesButtonColors} 
              />
            </div>
          </div>

          {/* Right side - Icon aligned to bottom */}
          <div className="hidden lg:flex lg:w-[240px] xl:w-[280px] items-end justify-center shrink-0">
            <img
              src={currentModality.iconSrc}
              alt={currentModality.title}
              className="animate-icon w-full max-w-[220px] xl:max-w-[260px] h-auto object-contain"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
