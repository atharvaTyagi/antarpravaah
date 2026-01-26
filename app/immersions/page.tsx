'use client';

import { useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import { getCloudinaryUrl } from '@/lib/cloudinary';

gsap.registerPlugin(ScrollTrigger);

export default function ImmersionsPage() {
  // Setup GSAP fade transitions between sections
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for DOM to be ready
    const setupTimeout = setTimeout(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.immersions-section');
      if (sections.length === 0) return;

      // Create fade transitions for each section
      sections.forEach((section, index) => {
        const sectionId = section.id;

        // Skip first section - it starts visible
        if (index === 0) {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Skip carousel sections - they handle their own visibility
        if (sectionId === 'immersions-listings' || sectionId === 'trainings-listings') {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Set initial state - sections start completely invisible
        gsap.set(section, { opacity: 0 });

        // Fade in when section enters viewport
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(section, { opacity: self.progress });
          },
        });

        // Fade out the previous section as this one enters
        if (index > 0) {
          const prevSection = sections[index - 1];
          const prevSectionId = prevSection.id;

          // Don't fade out carousel sections
          if (prevSectionId === 'immersions-listings' || prevSectionId === 'trainings-listings') return;

          ScrollTrigger.create({
            trigger: section,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.5,
            onUpdate: (self) => {
              const opacity = 1 - self.progress;
              gsap.set(prevSection, { opacity });
            },
            onLeaveBack: () => {
              gsap.to(prevSection, { opacity: 1, duration: 0.3 });
            },
          });
        }
      });

      ScrollTrigger.refresh(true);
    }, 500);

    return () => {
      clearTimeout(setupTimeout);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#f6edd0]">
      {/* ===== SECTION 1: Hero/Introduction ===== */}
      <Section
        id="immersions"
        className="immersions-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
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
      </Section>

      {/* ===== SECTION 2: Immersions Introduction with Blob Background ===== */}
      <Section
        id="immersions-intro"
        className="immersions-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
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
          {/* Three column layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 lg:gap-12">
            {/* Left decorative image */}
            <div className="pointer-events-none hidden sm:flex items-center justify-center lg:mt-8">
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
            <div className="flex w-full max-w-[400px] flex-col items-center gap-3 sm:gap-4 text-center text-[#6a3f33]">
              <h2
                className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Immersions
              </h2>
              <h3
                className="text-[14px] sm:text-[15px] lg:text-[16px] uppercase leading-normal tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Transformative Gatherings
              </h3>
              <div
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p className="mb-4">
                  Immersions at Antar Pravaah focus on meaningful themes without delving deeply into personal
                  histories. These gatherings create space for broader awareness—exploring how different areas
                  of your life interconnect and influence one another.
                </p>
                <p>
                  Through group exploration, you&apos;ll gain insights into life patterns and connections,
                  supported by community energy and collective transformation.
                </p>
              </div>
            </div>

            {/* Right decorative image */}
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

          {/* Bottom center decorative image */}
          <div className="pointer-events-none mx-auto mt-8 flex items-center justify-center">
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
      </Section>

      {/* ===== SECTION 3: Upcoming Immersions Carousel (Dark) ===== */}
      <Section
        id="immersions-listings"
        className="immersions-section relative z-10 w-full min-h-screen flex flex-col justify-center bg-[#6a3f33] py-12 sm:py-16 lg:py-20"
      >
        <div className="flex flex-col gap-6 sm:gap-8">
          <h3
            className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761] px-4 sm:px-6 lg:px-16"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Upcoming Immersions & Workshops
          </h3>

          {/* Horizontal scrollable container */}
          <div className="no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-16">
            {/* Card 1: Antar Smaran */}
            <div className="flex min-w-[320px] sm:min-w-[600px] lg:min-w-[900px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* Left column: Info box + Image */}
                <div className="flex flex-1 flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-[#6a3f33] p-3">
                    {/* Title and Tag */}
                    <div className="flex flex-col gap-2">
                      <h4
                        className="text-[22px] sm:text-[26px] lg:text-[32px] leading-tight text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Antar Smaran Immersive Residential Retreat
                      </h4>
                      <span
                        className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                      >
                        Immersion
                      </span>
                    </div>

                    {/* Two-column grid for details */}
                    <div className="grid grid-cols-2 gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                          Duration
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          2 Days
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                          Language
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          English and Hindi
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                          Prerequisite
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          21 years and above<br />
                          No prior experience required.
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                          Format
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          In-person
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-1 min-h-[160px] lg:min-h-[180px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_1')}
                      alt="Antar Smaran Immersive"
                      width={400}
                      height={250}
                      quality={85}
                      loading="lazy"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>

                {/* Right column: About and What To Expect */}
                <div className="flex flex-1 flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                      About
                    </p>
                    <div className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <p className="mb-3">
                        Antar Smaran is a once-a-year residential retreat designed to guide participants into deep connection with their inner self and the natural flow of life within.
                      </p>
                      <p className="mb-3">
                        This immersion weaves together the principles of energy healing, inner child integration, and shamanic practices with the timeless wisdom of ancient yogic traditions.
                      </p>
                      <p>
                        Grounded yet expansive, the Antar Smaran Immersive helps you create a daily roadmap rooted in awareness, balance, and compassion.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                      What To Expect
                    </p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>Meditations and energy healing to awaken flow</li>
                      <li>Inner child work to release old patterns</li>
                      <li>Shamanic practices to expand awareness</li>
                      <li>Yogic techniques for inner awareness</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  text="Reserve your spot"
                  size="small"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>

            {/* Card 2: Thread of Life */}
            <div className="flex min-w-[320px] sm:min-w-[600px] lg:min-w-[900px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex flex-1 flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-[#6a3f33] p-3">
                    <div className="flex flex-col gap-2">
                      <h4
                        className="text-[22px] sm:text-[26px] lg:text-[32px] leading-tight text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Thread of Life - A Systemic Constellations experience
                      </h4>
                      <span
                        className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                      >
                        Immersion
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>6 Hours (10AM - 4PM)</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>English</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisite</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>16 years and above. No prior experience required.</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>In-person</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[160px] lg:min-h-[180px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_2')}
                      alt="Thread of Life"
                      width={400}
                      height={250}
                      quality={85}
                      loading="lazy"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>About</p>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      These thematic constellation workshops explore collective and individual patterns in a supportive space. Whether you represent, have your own issue addressed, or observe, the process offers insights for everyone.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What To Expect</p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>Gain insights, healing, and clarity</li>
                      <li>Witness transformative dynamics in action</li>
                      <li>Get an overview of systemic work</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  text="Reserve your spot"
                  size="small"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>

            {/* Card 3: Meet your Primary Animal Guide */}
            <div className="flex min-w-[320px] sm:min-w-[600px] lg:min-w-[900px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex flex-1 flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-[#6a3f33] p-3">
                    <div className="flex flex-col gap-2">
                      <h4
                        className="text-[22px] sm:text-[26px] lg:text-[32px] leading-tight text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Meet your Primary Animal Guide
                      </h4>
                      <span
                        className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
                      >
                        Workshop
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>3 Hours</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>English</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisite</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Open to everyone above 11 years</p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Online</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[160px] lg:min-h-[180px]">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/immersion_workshop_3')}
                      alt="Primary Animal Guide"
                      width={400}
                      height={250}
                      quality={85}
                      loading="lazy"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>About</p>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      In Shamanism, connecting with your personal animal guide is a foundational step. Animals serve as gatekeepers of the natural spirit world, guiding us on journeys into the unseen.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What To Expect</p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>Identify your own Primary spirit animal guide</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  text="Reserve your spot"
                  size="small"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SECTION 4: Trainings Introduction with Blob Background ===== */}
      <Section
        id="trainings-intro"
        className="immersions-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
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
          {/* Three column layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:gap-8 lg:gap-12">
            {/* Left decorative image */}
            <div className="pointer-events-none hidden sm:flex items-center justify-center lg:mt-8">
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
            <div className="flex w-full max-w-[400px] flex-col items-center gap-3 sm:gap-4 text-center text-[#6a3f33]">
              <h2
                className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0]"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Trainings
              </h2>
              <h3
                className="text-[14px] sm:text-[15px] lg:text-[16px] uppercase leading-normal tracking-[2.5px] sm:tracking-[3px] lg:tracking-[3.84px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Become Your Own Healer
              </h3>
              <div
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p className="mb-4">
                  Our training programs offer more than certification—they offer transformation. As you learn to facilitate healing for others, you become your own most skilled healer.
                </p>
                <p>
                  Each training includes hands-on practice, personal healing work, mentorship, and certification that opens doors to professional practice.
                </p>
              </div>
            </div>

            {/* Right decorative image */}
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

          {/* Bottom center decorative image */}
          <div className="pointer-events-none mx-auto mt-8 flex items-center justify-center">
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
      </Section>

      {/* ===== SECTION 5: Upcoming Trainings Carousel (Dark) ===== */}
      <Section
        id="trainings-listings"
        className="immersions-section relative z-10 w-full min-h-screen flex flex-col justify-center bg-[#6a3f33] py-8 sm:py-12 lg:py-16"
      >
        <div className="flex flex-col gap-6 sm:gap-8 h-full">
          <h3
            className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761] px-4 sm:px-6 lg:px-16"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Upcoming Trainings
          </h3>

          {/* Full-width carousel container */}
          <div className="no-scrollbar flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-16 flex-1 items-stretch">
            {/* Training Card 1: Foundations of Shamanic Practice */}
            <div className="flex w-[340px] sm:w-[480px] lg:w-[560px] min-h-[calc(100vh-220px)] sm:min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-180px)] flex-shrink-0 flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4">
                  <h4
                    className="text-[24px] sm:text-[28px] lg:text-[32px] leading-tight text-[#6a3f33]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Foundations of Shamanic Practice
                  </h4>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                      <div className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        <p className="mb-0">Total 30 hours</p>
                        <p className="mb-0">3-hour Classes</p>
                        <p>Twice a month</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisites</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>17 and above, Open to everyone</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Online</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>English</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Overview</p>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      This is the Foundation course in Shamanic Arts that offers participants an insight into what Shamanism is, its origins and its practice.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What You&apos;ll Learn</p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>Identify your Primary Animal Spirit guide</li>
                      <li>Understand Shamanic Journeys</li>
                      <li>Archetypal energies in Shamanism</li>
                      <li>Fundamental tools in Shamanic work</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-auto pt-4">
                <Button
                  text="Enroll in this Training"
                  size="large"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>

            {/* Training Card 2: AP Energy Healing Level 1 */}
            <div className="flex w-[340px] sm:w-[480px] lg:w-[560px] min-h-[calc(100vh-220px)] sm:min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-180px)] flex-shrink-0 flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4">
                  <h4
                    className="text-[24px] sm:text-[28px] lg:text-[32px] leading-tight text-[#6a3f33]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Antar Pravaah Energy Healing Level 1
                  </h4>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Total 12 hours, Weekend Classes</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisites</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>18+, No prior experience required</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>In-person</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>English and Hindi</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Overview</p>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      The Level 1 AP Energy Healing course is designed to familiarise participants with the concept of Energy in respect to Healing and learn tools for self healing.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What You&apos;ll Learn</p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>Nature of energy</li>
                      <li>Basic human physiology</li>
                      <li>Principles of self healing</li>
                      <li>Tools for Self Healing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-auto pt-4">
                <Button
                  text="Enroll in this Training"
                  size="large"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>

            {/* Training Card 3: Chakra Energy System */}
            <div className="flex w-[340px] sm:w-[480px] lg:w-[560px] min-h-[calc(100vh-220px)] sm:min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-180px)] flex-shrink-0 flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-4 rounded-lg border border-[#6a3f33] p-4">
                  <h4
                    className="text-[24px] sm:text-[28px] lg:text-[32px] leading-tight text-[#6a3f33]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Chakra Energy System Fundamentals
                  </h4>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Duration</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Total 15 hours, 3-hour Class Weekly</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Prerequisites</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>18+, No prior experience required</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Format</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Hybrid - Online & In-person</p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>Language</p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>English & Hindi</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-[#6a3f33]" style={{ lineHeight: '20px' }}>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>Overview</p>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      Chakras are the blueprints upon which the Human body is created and experienced. This training enables the understanding of this complex system.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>What You&apos;ll Learn</p>
                    <ul className="ml-4 list-disc text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}>
                      <li>What Chakras are and are NOT</li>
                      <li>Interactions in life experience</li>
                      <li>Tools to harmonise energy flow</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-auto pt-4">
                <Button
                  text="Enroll in this Training"
                  size="large"
                  colors={{
                    fg: '#6a3f33',
                    fgHover: '#d58761',
                    bgHover: '#6a3f33',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SECTION 6: CTA - Ready to step into your power ===== */}
      <Section
        id="cta"
        className="immersions-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#f6edd0]"
      >
        <div className="mx-auto flex max-w-full sm:max-w-[600px] lg:max-w-[687px] flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
          <h2
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.0] text-[#d58761]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Ready to step into your power?
          </h2>

          <div className="flex items-center justify-center">
            <PageEndBlob color="#d58761" className="w-[100px] sm:w-[130px] lg:w-[163px] h-auto" />
          </div>

          <p
            className="text-[16px] sm:text-[20px] lg:text-[24px] leading-normal text-[#d58761] px-4"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Whether you&apos;re joining us for a single workshop or embarking on a comprehensive training
            journey, every gathering is an opportunity for transformation. Your healing journey ripples
            outward—to your family, your community, and the world.
          </p>

          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
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
          </div>
        </div>
      </Section>
    </main>
  );
}
