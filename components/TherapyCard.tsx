'use client';

import { Therapy, DescriptionItem } from '@/data/therapiesContent';
import Button from './Button';

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

  // Helper to render description based on type
  const renderDescription = () => {
    if (typeof therapy.description === 'string') {
      return (
        <p
          className="text-[#645c42] text-[12px] text-justify leading-normal"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
        >
          {therapy.description}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {therapy.description.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <p
                key={idx}
                className="text-[#645c42] text-[12px] text-justify leading-normal"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {item}
              </p>
            );
          }
          const descItem = item as DescriptionItem;
          return (
            <div key={idx} className="flex flex-col gap-2">
              <p
                className="text-[#645c42] text-[12px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                {descItem.heading}
              </p>
              <p
                className="text-[#645c42] text-[12px] text-justify leading-normal"
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
    // Special layout for ASP (centered)
    return (
      <div className="w-full bg-[#d6c68e] rounded-[24px] p-10 flex flex-col items-center gap-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        {/* Icon centered at top */}
        <div className="w-full flex justify-center">
          <img
            src={therapy.icon}
            alt={therapy.title}
            className="h-[186px] w-auto object-contain"
          />
        </div>

        {/* Content centered */}
        <div className="flex flex-col gap-4 items-center text-center max-w-[450px]">
          <h3
            className="text-[48px] leading-normal text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <p
            className="text-[24px] leading-normal text-[#645c42] uppercase tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {therapy.subtitle}
          </p>
          <div className="text-[#645c42] text-[12px] text-justify leading-normal w-[400px]">
            {renderDescription()}
          </div>

          {/* CTA */}
          <div className="mt-4">
            <Button text={therapy.ctaText} size="small" colors={therapiesButtonColors} />
          </div>
        </div>
      </div>
    );
  }

  // Standard layout - Figma design: Icon top-right, content on left
  return (
    <div className="w-full bg-[#d6c68e] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-8">
      <div className="flex flex-row gap-8">
        {/* Content - takes most of the space */}
        <div className="flex-1 flex flex-col gap-3">
          <h3
            className="text-[48px] leading-tight text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            {therapy.title}
          </h3>
          <p
            className="text-[24px] leading-normal text-[#645c42] uppercase tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {therapy.subtitle}
          </p>

          {/* Description */}
          {renderDescription()}

          {/* Best For section */}
          {therapy.bestFor.length > 0 && (
            <div className="flex flex-col gap-2">
              <p
                className="text-[#645c42] text-[12px] uppercase tracking-[1.92px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Best For
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-1">
                {therapy.bestFor.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-[#645c42] text-[12px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Session Duration */}
          <div className="flex flex-col gap-1">
            <p
              className="text-[#645c42] text-[12px] uppercase tracking-[1.92px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Session Duration
            </p>
            <p
              className="text-[#645c42] text-[12px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
            >
              {therapy.duration}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-2">
            <Button text={therapy.ctaText} size="small" colors={therapiesButtonColors} />
          </div>
        </div>

        {/* Icon - positioned on the right, aligned to top */}
        <div className="shrink-0 w-[200px] h-[200px] flex items-start justify-center pt-4">
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

