'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Therapy, DescriptionItem } from '@/data/therapiesContent';
import Button from './Button';

gsap.registerPlugin(ScrollTrigger);

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',      // Dark brown text in non-hovered state
  fgHover: '#d6c68e', // Light gold text on hover
  bgHover: '#645c42', // Dark brown background on hover
};

interface TherapyCardProps {
  therapy: Therapy;
}

export default function TherapyCard({ therapy }: TherapyCardProps) {
  const isCenter = therapy.iconPosition === 'center';
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const bestForRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Fade-in animation effect (same as "Come and find me" section)
  useEffect(() => {
    if (!cardRef.current) return;

    const elements = [
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      bestForRef.current,
      durationRef.current,
      ctaRef.current,
      iconRef.current,
    ].filter((el) => el !== null);

    if (elements.length === 0) return;

    // Set initial state - everything invisible
    gsap.set(elements, {
      opacity: 0,
      y: 20,
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    // Animate elements with stagger
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Helper to render description based on type
  const renderDescription = () => {
    if (typeof therapy.description === 'string') {
      return (
        <p
          className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
        >
          {therapy.description}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-4 sm:gap-5">
        {therapy.description.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <p
                key={idx}
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {item}
              </p>
            );
          }
          const descItem = item as DescriptionItem;
          return (
            <div key={idx} className="flex flex-col gap-2 sm:gap-3">
              <p
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                {descItem.heading}
              </p>
              <p
                className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] text-justify leading-[24px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {descItem.text}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  if (isCenter) {
    // Special layout for ASP (centered) - larger card with more padding
    return (
      <div ref={cardRef} className="w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[840px] bg-[#d6c68e] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-8 sm:p-12 lg:p-20 flex flex-col items-center justify-center gap-8 sm:gap-10 lg:gap-12 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        {/* Icon centered at top */}
        <div ref={iconRef} className="w-full flex justify-center">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="h-[140px] sm:h-[160px] lg:h-[186px] w-auto object-contain"
          />
        </div>

        {/* Content centered */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 items-center text-center max-w-full sm:max-w-[500px] lg:max-w-[600px] px-2">
          <h3
            ref={titleRef}
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <div ref={descriptionRef} className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-justify w-full">
            {renderDescription()}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-4 sm:mt-6">
            <Button text={therapy.ctaText} size="large" colors={therapiesButtonColors} />
          </div>
        </div>
      </div>
    );
  }

  // Standard layout - Figma design: Icon top-right, content on left
  return (
    <div ref={cardRef} className="w-full bg-[#d6c68e] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Content - takes most of the space */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <h3
            ref={titleRef}
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-tight text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <p
            ref={subtitleRef}
            className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#645c42] tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {therapy.subtitle}
          </p>

          {/* Description */}
          <div ref={descriptionRef}>
            {renderDescription()}
          </div>

          {/* Best For section */}
          {therapy.bestFor.length > 0 && (
            <div ref={bestForRef} className="flex flex-col gap-1.5 sm:gap-2">
              <p
                className="text-[#645c42] text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.92px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Best For
              </p>
              <ul className="list-disc pl-5 sm:pl-6 flex flex-col gap-0.5 sm:gap-1">
                {therapy.bestFor.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#645c42] text-[11px] sm:text-[12px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Session Duration */}
          <div ref={durationRef} className="flex flex-col gap-0.5 sm:gap-1">
            <p
              className="text-[#645c42] text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.92px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Session Duration
            </p>
            <p
              className="text-[#645c42] text-[11px] sm:text-[12px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {therapy.duration}
            </p>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-1 sm:mt-2">
            <Button text={therapy.ctaText} size="small" colors={therapiesButtonColors} />
          </div>
        </div>

        {/* Icon - positioned on the right, aligned to top on desktop, centered on mobile */}
        <div ref={iconRef} className="shrink-0 w-full h-[140px] sm:h-[160px] lg:w-[200px] lg:h-[200px] flex items-center lg:items-start justify-center lg:pt-4">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

