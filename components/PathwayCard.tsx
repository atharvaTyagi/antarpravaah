'use client';

import Button from './Button';

// Pathways page button colors matching the teal theme
const pathwaysButtonColors = {
  fg: '#9ac1bf', // Teal text in non-hovered state
  fgHover: '#354443', // Dark teal text on hover
  bgHover: '#9ac1bf', // Teal background on hover
};

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  whatToExpect: string[];
  ctaText: string;
  ctaHref: string;
  image: string;
}

interface PathwayCardProps {
  pathway: Pathway;
}

export default function PathwayCard({ pathway }: PathwayCardProps) {
  return (
    <div
      className="relative flex items-end overflow-hidden rounded-[12px] sm:rounded-[16px] lg:rounded-[24px] border-[4px] sm:border-[8px] lg:border-[12px] border-[#9ac1bf] w-full h-full"
    >
      {/* Background Image with blur */}
      <div className="absolute inset-0 -z-10">
        <img
          src={pathway.image}
          alt=""
          className="h-full w-full object-cover blur-[2px]"
          style={{ transform: 'scale(1.1)' }}
        />
      </div>

      {/* Content Card - Figma specs: backdrop blur, 80% opacity dark bg */}
      <div
        className="w-full max-w-full sm:max-w-[70%] lg:max-w-[50%] rounded-[8px] sm:rounded-[12px] lg:rounded-[20px] bg-[rgba(53,68,67,0.8)] p-3 sm:p-4 lg:p-5 m-2 sm:m-4 lg:m-6 backdrop-blur-[4px] overflow-y-auto"
        style={{
          maxHeight: 'calc(100% - 1rem)',
        }}
      >
        {/* Title - 48px Safira March */}
        <h3
          className="mb-2 lg:mb-3 text-[clamp(1.5rem,4vw,3rem)] leading-[1.0] text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {pathway.title}
        </h3>
        
        {/* Subtitle - 24px Graphik Medium */}
        <p
          data-element="subtitle"
          className="mb-2 lg:mb-3 text-[clamp(0.875rem,2vw,1.5rem)] leading-[1.2] text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
        >
          {pathway.subtitle}
        </p>
        
        {/* Description - 16px Graphik Regular, 24px line height */}
        <div 
          className="mb-2 lg:mb-3 text-justify text-[clamp(0.75rem,1.5vw,1rem)] leading-relaxed text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
        >
          {pathway.description.map((para, idx) => (
            <p key={idx} className={idx < pathway.description.length - 1 ? 'mb-2 lg:mb-3' : ''}>
              {para}
            </p>
          ))}
        </div>
        
        {/* What to Expect - 16px Graphik */}
        <div 
          className="mb-2 lg:mb-3 text-[clamp(0.75rem,1.5vw,1rem)] leading-relaxed text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
        >
          <p className="mb-1 font-medium">What to Expect:</p>
          <ul className="list-inside list-disc space-y-0.5">
            {pathway.whatToExpect.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        
        {/* CTA Button */}
        <Button
          text={pathway.ctaText}
          href={pathway.ctaHref}
          mode="dark"
          size="default"
          colors={pathwaysButtonColors}
        />
      </div>
    </div>
  );
}
