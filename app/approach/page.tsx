'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import PathwaysCardStack from '@/components/PathwaysCardStack';
import PathwayCard from '@/components/PathwayCard';
import { pathways } from '@/data/pathwaysContent';

gsap.registerPlugin(ScrollTrigger);

export default function ApproachPage() {

  // Prepare cards for the sticky stack
  const pathwayCards = pathways.map((pathway) => ({
    key: pathway.id,
    render: <PathwayCard pathway={pathway} />,
  }));

  return (
    <main className="relative min-h-screen bg-[#f6edd0] pt-[90px] sm:pt-[108px] lg:pt-[148px]">
      {/* Hero/Introduction Section */}
      <Section id="approach" className="relative w-full bg-[#f6edd0] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1349px] flex-col items-center gap-3 sm:gap-4 text-center">
          {/* Large Spiral SVG from assets */}
          <div className="mb-6 sm:mb-8 flex w-[25%] sm:w-[18%] lg:w-[155px] max-w-[155px] items-center justify-center">
            <img
              src="/approach_vector.svg"
              alt=""
              className="w-full h-auto object-contain"
            />
          </div>

          <h1
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-normal text-[#9ac1bf]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            We Work Together
          </h1>

          <div className="max-w-full sm:max-w-[360px] lg:max-w-[401px] text-justify text-[11px] sm:text-[12px] leading-normal text-[#474e3a] px-4">
            <p className="mb-4">
              At Antar Pravaah, healing is a shared responsibility. We both do the work.
              Transformation demands commitment and persistence. It's not force, it's flow, but
              even in that, the commitment to follow the flow is integral to the work.
            </p>
            <p className="mb-4">
              I have been doing this work for 20 years, and I can tell you with a fair bit of
              certainty, it rarely works. Why? Because we want change to the extent of the
              outermost limits of our own comfort zone.
            </p>
            <p>
              Healing or transformation works when you are willing to take baby steps out of your
              comfortable space and step into the unfamiliar. The start is always from the place
              where you are. Every step matters.
            </p>
          </div>
        </div>
      </Section>

      {/* Dark section starts here */}
      <div className="relative w-full bg-[#354443]">
        {/* Subtle spiral pattern background - Grid system */}
        <div className="pointer-events-none absolute inset-0 z-[1] grid grid-cols-10 grid-rows-10 opacity-20">
          {Array.from({ length: 100 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src="/approach_blob.svg"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Three Pathways Section with GSAP Card Stack */}
        <Section id="pathways" className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1347px]">
            {/* Section Title - Outside card stack so it scrolls normally */}
            <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
              <h2
                className="text-[32px] sm:text-[38px] lg:text-[48px] leading-normal text-[#9ac1bf]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Three Pathways for You
              </h2>
            </div>
            <PathwaysCardStack cards={pathwayCards} />
          </div>
        </Section>

        {/* Thoughts & Ponderings Section */}
        <Section id="thoughts" className="relative z-10 w-full bg-[#f6edd0] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1349px] flex-col items-center gap-6 sm:gap-8 lg:gap-10">
            <h2
              className="text-center text-[32px] sm:text-[40px] lg:text-[48px] leading-normal text-[#354443] px-4"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Thoughts & Ponderings
            </h2>
            <p
              className="text-center text-[18px] sm:text-[20px] lg:text-[24px] uppercase leading-normal tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px] text-[#354443] px-4"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              A wall of my current thoughts & ponderings
            </p>

            {/* Grid of thought cards - text only */}
            <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Row 1 */}
              <div className="flex min-h-[180px] sm:min-h-[200px] items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10">
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="flex min-h-[180px] sm:min-h-[200px] items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10">
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="lg:row-span-2 flex min-h-[180px] sm:min-h-[200px] lg:min-h-[416px] items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10">
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>

              {/* Row 2 */}
              <div className="flex min-h-[180px] sm:min-h-[200px] items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10">
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="flex min-h-[180px] sm:min-h-[200px] items-center justify-center rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10">
                <p
                  className="text-center text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>

              
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section id="approach-cta" className="relative z-10 w-full bg-[#f6edd0] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto flex max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1349px] flex-col items-center gap-4 sm:gap-5 lg:gap-6 text-center">
            {/* Decorative blob */}
            <div className="mb-3 sm:mb-4">
              <PageEndBlob color="#9ac1bf" className="h-auto w-[120px] sm:w-[140px] lg:w-[163px]" />
            </div>

            <p
              className="max-w-full sm:max-w-[680px] lg:max-w-[799px] text-[28px] sm:text-[38px] lg:text-[48px] leading-normal text-[#9ac1bf] px-4"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              If you feel called, I welcome you. Whatever you carry, you're not alone.
            </p>

            <Button
              text="Begin Your Journey"
              href="/contact"
              size="large"
              mode="light"
              colors={{
                fg: '#354443',
                fgHover: '#f6edd0',
                bgHover: '#354443',
              }}
            />
          </div>
        </Section>
      </div>
    </main>
  );
}
