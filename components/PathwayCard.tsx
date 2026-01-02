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
    <div className="relative flex h-[680px] items-end overflow-hidden rounded-[24px] border-[16px] border-[#9ac1bf]">
      {/* Background Image with blur */}
      <div className="absolute inset-0 -z-10">
        <img
          src={pathway.image}
          alt=""
          className="h-full w-full object-cover blur-[2px]"
          style={{ transform: 'scale(1.1)' }}
        />
      </div>

      {/* Content Card */}
      <div className="w-full max-w-[640px] rounded-[20px] bg-[rgba(53,68,67,0.85)] p-6 m-8 backdrop-blur-[2px]">
        <h3
          className="mb-2 text-[32px] leading-tight text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {pathway.title}
        </h3>
        <p
          className="mb-3 text-[16px] uppercase leading-normal tracking-[2.56px] text-[#9ac1bf]"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
        >
          {pathway.subtitle}
        </p>
        <div className="mb-3 text-justify text-[11px] leading-relaxed text-[#9ac1bf]">
          {pathway.description.map((para, idx) => (
            <p key={idx} className={idx < pathway.description.length - 1 ? 'mb-2' : ''}>
              {para}
            </p>
          ))}
        </div>
        <div className="mb-3 text-[11px] leading-relaxed text-[#9ac1bf]">
          <p className="mb-1 font-medium">What to Expect:</p>
          <ul className="list-inside list-disc">
            {pathway.whatToExpect.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <Button
          text={pathway.ctaText}
          href={pathway.ctaHref}
          mode="dark"
          colors={pathwaysButtonColors}
        />
      </div>
    </div>
  );
}
