'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import { getCloudinaryUrl } from '@/lib/cloudinary';

export default function ImmersionsPage() {
  useEffect(() => {
    // Native scroll; no smooth scroll library needed
  }, []);

  return (
    <main className="relative min-h-screen bg-[#f6edd0] pt-[90px] sm:pt-[108px] lg:pt-[148px]">
      {/* Hero/Introduction Section */}
      <Section id="immersions" className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto flex max-w-[723px] flex-col items-center gap-3 sm:gap-4 lg:gap-5 text-center">
          <h1
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-normal text-[#6a3f33]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Immersions & Trainings
          </h1>
          <h2
            className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#6a3f33]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Gather, Learn, Transform Together
          </h2>
          <div className="text-justify text-[11px] sm:text-[11.5px] lg:text-[12px] leading-normal text-[#6a3f33] px-4" style={{ fontFamily: 'var(--font-graphik), sans-serif' }}>
            <p className="mb-0">
              Healing deepens when experienced in community. Whether you&apos;re exploring a theme that
              resonates with your journey, or stepping into the role of healer yourself, our immersions
              & trainings create sacred containers for collective transformation.
            </p>
            <p className="mb-0">&nbsp;</p>
            <p>
              Here, you&apos;ll find workshops that illuminate life&apos;s patterns, training programs that
              empower you to become your own healer, and gatherings that remind you—you&apos;re not alone on
              this path.
            </p>
          </div>
        </div>
      </Section>

      {/* Decorative blob background for Immersions section - Hidden on mobile */}
      <div className="absolute left-1/2 top-[283px] z-0 hidden lg:flex h-[1374px] w-[1326px] -translate-x-1/2 items-center justify-center">
        <img src="/immersion_main_blob.svg" alt="" className="h-[744px] w-[1171px]" />
      </div>

      {/* Immersion Introduction */}
      <Section id="immersions-intro" className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="relative mx-auto max-w-[1000px]">
          {/* Three column layout: left image | center content | right image (stacks on mobile) */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6 lg:gap-8">
            {/* Left decorative image - Hidden on mobile */}
            <div className="pointer-events-none mt-0 lg:mt-8 h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px] shrink-0 hidden sm:block">
              <Image
                src={getCloudinaryUrl('antarpravaah/immersions/antarpravaah/immersions/immersion_1')}
                alt=""
                width={200}
                height={200}
                quality={85}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Center content */}
            <div className="flex w-full max-w-[400px] flex-col items-center gap-3 sm:gap-4 text-center text-[#6a3f33]">
              <h2
                className="text-[32px] sm:text-[40px] lg:text-[48px] leading-normal"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Immersions
              </h2>
              <h3
                className="text-[16px] sm:text-[20px] lg:text-[24px] uppercase leading-normal tracking-[2px] sm:tracking-[3px] lg:tracking-[3.84px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Transformative Gatherings
              </h3>
              <div className="text-justify text-[11px] sm:text-[11.5px] lg:text-[12px] leading-normal px-4" style={{ fontFamily: 'var(--font-graphik), sans-serif' }}>
                <p className="mb-0">
                  Immersions at Antar Pravaah focus on meaningful themes without delving deeply into personal
                  histories. These gatherings create space for broader awareness—exploring how different areas
                  of your life interconnect and influence one another.
                </p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Through group exploration, you&apos;ll gain insights into life patterns and connections,
                  supported by community energy and collective transformation.
                </p>
              </div>
            </div>

            {/* Right decorative image - Hidden on mobile/tablet */}
            <div className="pointer-events-none mt-0 lg:mt-16 h-[140px] w-[140px] lg:h-[180px] lg:w-[180px] shrink-0 hidden lg:block">
              <Image
                src={getCloudinaryUrl('antarpravaah/immersions/antarpravaah/immersions/immersion_2')}
                alt=""
                width={180}
                height={180}
                quality={85}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom center decorative image */}
          <div className="pointer-events-none mx-auto mt-4 sm:mt-6 lg:mt-8 h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]">
            <Image
              src={getCloudinaryUrl('antarpravaah/immersions/antarpravaah/immersions/immersion_3')}
              alt=""
              width={280}
              height={280}
              quality={85}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Section>

      {/* Dark section for Immersions listings */}
      <div className="relative w-full bg-[#6a3f33]">
        <Section id="immersions-listings" className="relative z-10 w-full px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto flex max-w-[2463px] flex-col gap-6 sm:gap-8">
            <h3
              className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Upcoming Immersions & Workshops
            </h3>

            {/* Horizontal scrollable container */}
            <div className="no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-4">
              {/* Card 1: Antar Smaran */}
              <div className="flex min-w-[320px] sm:min-w-[500px] lg:min-w-[760px] flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Left column: Info */}
                  <div className="flex flex-1 flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Antar Smaran Immersive Residential Retreat
                      </h4>
                      <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Immersion
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 sm:gap-2">
                      <p className="text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[1.5px] sm:tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Duration
                      </p>
                      <p className="text-[18px] sm:text-[20px] lg:text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        2 Days
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Prerequisite
                      </p>
                      <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        <p className="mb-0">21 years and above</p>
                        <p>No prior experience required.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Language
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        English and Hindi
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Format
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        In-person
                      </p>
                    </div>
                  </div>

                  {/* Right column: Image + Details */}
                  <div className="flex flex-1 flex-col gap-4">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/antarpravaah/immersions/workshops/immersion_workshop_1')}
                      alt="Antar Smaran Immersive"
                      width={400}
                      height={206}
                      quality={85}
                      loading="lazy"
                      className="h-[206px] w-full rounded-2xl object-cover"
                    />

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          About
                        </p>
                        <div className="text-justify text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          <p className="mb-0">
                            Antar Smaran is a once-a-year residential retreat designed to guide participants into deep connection with their inner self and the natural flow of life within.
                          </p>
                          <p className="mb-0 text-[12px]">&nbsp;</p>
                          <p className="mb-0">
                            This immersion weaves together the principles of energy healing, inner child integration, and shamanic practices with the timeless wisdom of ancient yogic traditions. Through meditation, guided processes, and embodied practices, participants are supported in uncovering inner patterns, releasing emotional blockages, and reconnecting to the higher self.
                          </p>
                          <p className="mb-0 text-[12px]">&nbsp;</p>
                          <p>
                            Grounded yet expansive, the Antar Smaran Immersive helps you create a daily roadmap rooted in awareness, balance, and compassion—living in harmony with yourself and the greater flow of life.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          What To Expect
                        </p>
                        <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          <li>Meditations and energy healing to awaken flow</li>
                          <li>Inner child work to release old patterns</li>
                          <li>Shamanic practices to expand awareness and connection</li>
                          <li>Yogic techniques for inner awareness</li>
                          <li>Tools to integrate insights into daily life</li>
                        </ul>
                      </div>
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
              <div className="flex min-w-[320px] sm:min-w-[500px] lg:min-w-[760px] flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex flex-1 flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Thread of Life - A Systemic Constellations experience
                      </h4>
                      <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Immersion
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Duration
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        6 Hours (10AM - 4PM)
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Prerequisite
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        16 years and above. No prior experience required.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Language
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        English
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Format
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        In-person
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/antarpravaah/immersions/workshops/immersion_workshop_2')}
                      alt="Thread of Life"
                      width={400}
                      height={206}
                      quality={85}
                      loading="lazy"
                      className="h-[206px] w-full rounded-2xl object-cover"
                    />

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          About
                        </p>
                        <p className="text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          These thematic constellation workshops explore collective and individual patterns in a supportive space. Whether you represent, have your own issue addressed, or observe, the process offers insights for everyone. Through participation and reflection, collective wisdom emerges, providing clarity, healing, and guidance to take into daily life.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          What To Expect
                        </p>
                        <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          <li>Gain insights, healing, and clarity</li>
                          <li>Witness transformative dynamics in action</li>
                          <li>Get an overview of systemic work</li>
                        </ul>
                      </div>
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
              <div className="flex min-w-[320px] sm:min-w-[500px] lg:min-w-[760px] flex-col justify-between gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex flex-1 flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Meet your Primary Animal Guide
                      </h4>
                      <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#6a3f33] px-2 py-0.5 text-[10px] sm:text-[11px] lg:text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Workshop
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Duration
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        3 Hours
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Prerequisite
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Open to everyone above the age of 11 years
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Language
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        English
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Format
                      </p>
                      <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Online
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4">
                    <Image
                      src={getCloudinaryUrl('antarpravaah/immersions/workshops/antarpravaah/immersions/workshops/immersion_workshop_3')}
                      alt="Primary Animal Guide"
                      width={400}
                      height={206}
                      quality={85}
                      loading="lazy"
                      className="h-[206px] w-full rounded-2xl object-cover"
                    />

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          About
                        </p>
                        <p className="text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          In Shamanism, connecting with your personal animal guide is a foundational step. Animals serve as gatekeepers of the natural spirit world, guiding us on journeys into the unseen. Meeting your own guide reveals insights into your unique nature, strengths, and attributes, while awakening a deeper connection to the natural world.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                          What To Expect
                        </p>
                        <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          <li>Identify your own Primary spirit animal guide</li>
                        </ul>
                      </div>
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
      </div>

      {/* Decorative blob background for Trainings section - Hidden on mobile */}
      <div className="absolute left-1/2 top-[2082px] z-0 hidden lg:flex h-[1374px] w-[1326px] -translate-x-1/2 items-center justify-center">
        <div className="rotate-[130.5deg] scale-y-[-1]">
          <img src="/immersion_main_blob.svg" alt="" className="h-[744px] w-[1171px]" />
        </div>
      </div>

      {/* Trainings Introduction */}
      <Section id="trainings-intro" className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="relative mx-auto max-w-[1000px]">
          {/* Three column layout: left image | center content | right image (stacks on mobile) */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 sm:gap-6 lg:gap-8">
            {/* Left decorative image - Hidden on mobile */}
            <div className="pointer-events-none mt-0 lg:mt-8 h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px] shrink-0 hidden sm:block">
              <Image
                src={getCloudinaryUrl('antarpravaah/trainings/antarpravaah/trainings/training_1')}
                alt=""
                width={200}
                height={200}
                quality={85}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Center content */}
            <div className="flex w-full max-w-[400px] flex-col items-center gap-3 sm:gap-4 text-center text-[#6a3f33]">
              <h2
                className="text-[32px] sm:text-[40px] lg:text-[48px] leading-normal"
                style={{ fontFamily: 'var(--font-saphira), serif' }}
              >
                Trainings
              </h2>
              <h3
                className="text-[16px] sm:text-[20px] lg:text-[24px] uppercase leading-normal tracking-[2px] sm:tracking-[3px] lg:tracking-[3.84px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Become Your Own Healer
              </h3>
              <div className="text-justify text-[11px] sm:text-[11.5px] lg:text-[12px] leading-normal px-4" style={{ fontFamily: 'var(--font-graphik), sans-serif' }}>
                <p className="mb-0">
                  Our training programs offer more than certification—they offer transformation. As you learn to facilitate healing for others, you become your own most skilled healer. These programs are intensive, experiential, and designed to change not just what you know, but who you are.
                </p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Each training includes hands-on practice, personal healing work, mentorship, and certification that opens doors to professional practice.
                </p>
              </div>
            </div>

            {/* Right decorative image - Hidden on mobile/tablet */}
            <div className="pointer-events-none mt-0 lg:mt-16 h-[140px] w-[140px] lg:h-[180px] lg:w-[180px] shrink-0 hidden lg:block">
              <Image
                src={getCloudinaryUrl('antarpravaah/trainings/antarpravaah/trainings/training_2')}
                alt=""
                width={180}
                height={180}
                quality={85}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom center decorative image */}
          <div className="pointer-events-none mx-auto mt-4 sm:mt-6 lg:mt-8 h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]">
            <Image
              src={getCloudinaryUrl('antarpravaah/trainings/antarpravaah/trainings/training_3')}
              alt=""
              width={280}
              height={280}
              quality={85}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Section>

      {/* Dark section for Trainings listings */}
      <div className="relative w-full bg-[#6a3f33]">
        <Section id="trainings-listings" className="relative z-10 w-full px-4 sm:px-6 lg:px-16 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto flex max-w-[2463px] flex-col gap-6 sm:gap-8">
            <h3
              className="text-[20px] sm:text-[22px] lg:text-[24px] leading-normal text-[#d58761]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Upcoming Trainings
            </h3>

            {/* Grid of training cards */}
            <div className="no-scrollbar flex gap-4 sm:gap-5 overflow-x-auto pb-4">
              {/* Training Card 1: Foundations of Shamanic Practice */}
              <div className="flex min-w-[300px] sm:min-w-[450px] lg:min-w-[600px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Foundations of Shamanic Practice
                      </h4>
                    </div>

                    <div className="flex gap-10">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Duration
                          </p>
                          <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            <p className="mb-0">Total 30 hours</p>
                            <p className="mb-0">3-hour Classes</p>
                            <p>Twice a month</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Format
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            Online
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Prerequisites
                          </p>
                          <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            <p className="mb-0">17 and above</p>
                            <p>Open to everyone</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Language
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            English
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Next Class Dates
                      </p>
                      <div className="flex gap-2">
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          December 14, 2025
                        </span>
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          January 18, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Overview
                      </p>
                      <p className="text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        This is the Foundation course in Shamanic Arts that offers participants an insight into what Shamanism is, its origins and its practice.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        What You&apos;ll Learn
                      </p>
                      <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        <li>Identify your Primary Animal Spirit guide</li>
                        <li>Understand Shamanic Journeys</li>
                        <li>Become familiar with archetypal energies used for healing in Shamanism</li>
                        <li>Introduction to fundamental tools in Shamanic work</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    text="Enroll in this Training"
                    size="small"
                    colors={{
                      fg: '#6a3f33',
                      fgHover: '#d58761',
                      bgHover: '#6a3f33',
                    }}
                  />
                </div>
              </div>

              {/* Training Card 2: AP Energy Healing Level 1 */}
              <div className="flex min-w-[300px] sm:min-w-[450px] lg:min-w-[600px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Antar Pravaah Energy Healing Level 1 Training
                      </h4>
                    </div>

                    <div className="flex gap-10">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Duration
                          </p>
                          <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            <p className="mb-0">Total 12 hours</p>
                            <p>Weekend Classes</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Format
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            In-person
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Prerequisites
                          </p>
                          <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            <p className="mb-0">18 and above</p>
                            <p>No prior experience required.</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Language
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            English and Hindi
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Next Class Dates
                      </p>
                      <div className="flex gap-2">
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          December 14, 2025
                        </span>
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          January 18, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Overview
                      </p>
                      <p className="text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        The Level 1 AP Energy Healing course is designed to familiarise participants with the concept of Energy in respect to Healing and learn tools for self healing.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        What You&apos;ll Learn
                      </p>
                      <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        <li>Nature of energy</li>
                        <li>Basic understanding of human physiology</li>
                        <li>Principles of self healing</li>
                        <li>Tools for Self Healing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    text="Enroll in this Training"
                    size="small"
                    colors={{
                      fg: '#6a3f33',
                      fgHover: '#d58761',
                      bgHover: '#6a3f33',
                    }}
                  />
                </div>
              </div>

              {/* Training Card 3: Chakra Energy System */}
              <div className="flex min-w-[300px] sm:min-w-[450px] lg:min-w-[600px] flex-col justify-between gap-3 sm:gap-4 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#d58761] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-[#6a3f33] p-3 sm:p-4">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <h4
                        className="text-[24px] sm:text-[36px] lg:text-[48px] leading-tight sm:leading-normal text-[#6a3f33]"
                        style={{ fontFamily: 'var(--font-saphira), serif' }}
                      >
                        Chakra Energy System Fundamentals
                      </h4>
                    </div>

                    <div className="flex gap-10">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Duration
                          </p>
                          <div className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            <p className="mb-0">Total 15 hours</p>
                            <p className="mb-0">3-hour Class</p>
                            <p>Weekly</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Format
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            Hybrid - Online & In-person
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Prerequisites
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            18 years and above. No prior experience required.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                            Language
                          </p>
                          <p className="text-[24px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                            English & Hindi
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Next Class Dates
                      </p>
                      <div className="flex gap-2">
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          December 14, 2025
                        </span>
                        <span className="flex-1 rounded-full bg-[#6a3f33] px-2 py-0.5 text-center text-[12px] text-[#d58761]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                          January 18, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        Overview
                      </p>
                      <p className="text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        Chakras are the blueprints upon which the Human body is created and experienced. This training enables the understanding of this complex system, clarifies locations and access to these centres as well as provides means to harmonise flow through conscious and meditative practices.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] uppercase tracking-[1.92px] text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}>
                        What You&apos;ll Learn
                      </p>
                      <ul className="ml-4 list-disc text-[12px] leading-normal text-[#6a3f33]" style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}>
                        <li>Clear understanding of what Chakras and are NOT</li>
                        <li>Interactions of this system in the experience of our life</li>
                        <li>Tools to harmonise flow in these energy centres</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    text="Enroll in this Training"
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
      </div>

      {/* CTA Section - Light beige background */}
      <Section id="cta" className="relative z-10 w-full bg-[#f6edd0] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto flex max-w-[687px] flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
          <h2
            className="text-[32px] sm:text-[40px] lg:text-[48px] leading-normal text-[#d58761]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Ready to step into your power?
          </h2>

          <div className="flex h-[32px] sm:h-[36px] lg:h-[40px] w-[130px] sm:w-[146px] lg:w-[163px] items-center justify-center py-3 sm:py-4 lg:py-5">
            <PageEndBlob color="#d58761" className="w-full h-full" />
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
