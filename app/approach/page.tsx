'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';

export default function ApproachPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#f6edd0] pt-[148px]">
      {/* Hero/Introduction Section */}
      <Section id="approach" className="relative w-full bg-[#f6edd0] px-8 py-24">
        <div className="mx-auto flex max-w-[1349px] flex-col items-center gap-4 text-center">
          {/* Large Spiral SVG from assets */}
          <div className="mb-8 flex h-[460px] w-[155px] items-center justify-center">
            <img
              src="/approach_vector.svg"
              alt=""
              className="h-full w-full object-contain"
            />
          </div>

          <h1
            className="text-[48px] leading-normal text-[#9ac1bf]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            We Work Together
          </h1>

          <div className="max-w-[401px] text-justify text-[12px] leading-normal text-[#474e3a]">
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

        {/* Three Pathways Section */}
        <Section id="pathways" className="relative z-10 w-full px-8 py-20">
          <div className="mx-auto flex max-w-[1347px] flex-col gap-10">
            {/* Section Header */}
            <h2
              className="text-center text-[48px] leading-normal text-[#9ac1bf]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Three Pathways for You
            </h2>

            {/* Pathway Cards */}
            <div className="flex flex-col gap-6">
              {/* Card 1: Private Sessions */}
              <div className="relative flex h-[763px] items-end overflow-hidden rounded-[36px] border-[16px] border-[#9ac1bf] p-10">
                {/* Background Image with blur */}
                <div className="absolute inset-0 -z-10">
                  <img
                    src="/Private Sessions.webp"
                    alt=""
                    className="h-full w-full object-cover blur-[2px]"
                    style={{ transform: 'scale(1.1)' }}
                  />
                </div>

                {/* Content Card */}
                <div className="w-full max-w-[640px] rounded-[24px] bg-[rgba(53,68,67,0.8)] p-5 backdrop-blur-[2px]">
                  <h3
                    className="mb-4 text-[48px] leading-normal text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Private Sessions
                  </h3>
                  <p
                    className="mb-4 text-[24px] uppercase leading-normal tracking-[3.84px] text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    For Deep, Personalized Transformation
                  </p>
                  <div className="mb-4 text-justify text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-4">
                      Private sessions work well for when you have very specific or intimate
                      concerns. A pattern you find cyclically repeating; chronic physical
                      conditions; issues with unexplainable causes etc. These sessions are
                      unhurried, allowing time for deep healing. We create a mutually viable
                      structure to take you step by step from your problem into possibilities.
                      Here also, we explore individual and familial history—including medical
                      background—to uncover root causes and determine what's needed to clear them.
                    </p>
                    <p>Typically, a session will last 60 minutes (varying with the modality).</p>
                  </div>
                  <div className="mb-4 text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-2 font-medium">What to Expect:</p>
                    <ul className="list-inside list-disc">
                      <li>Exclusive time and space</li>
                      <li>A unique roadmap structured to your specific concern</li>
                    </ul>
                  </div>
                  <Button
                    text="Book a Private Session"
                    href="#"
                    mode="dark"
                    colors={{
                      fg: '#9ac1bf',
                      fgHover: '#354443',
                      bgHover: '#9ac1bf',
                    }}
                  />
                </div>
              </div>

              {/* Card 2: Antar Pravaah Immersions */}
              <div className="relative flex h-[763px] items-end overflow-hidden rounded-[36px] border-[16px] border-[#9ac1bf] p-10">
                <div className="absolute inset-0 -z-10">
                  <img
                    src="/AP Immersions.webp"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="w-full max-w-[640px] rounded-[24px] bg-[rgba(53,68,67,0.8)] p-5 backdrop-blur-sm">
                  <h3
                    className="mb-4 text-[48px] leading-normal text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Antar Pravaah Immersions
                  </h3>
                  <p
                    className="mb-4 text-[24px] uppercase leading-normal tracking-[3.84px] text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    For Thematic Exploration & Community
                  </p>
                  <div className="mb-4 text-justify text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-4">
                      Antar Pravaah Immersions focus on themes common to our lives, without
                      delving deeply into personal histories. They are ideal for when you are
                      curious about the interconnectedness of different areas of your life; or
                      when you wish to explore a modality, how it works without necessarily
                      sharing all your personal details. The beauty of such immersions is also
                      that it gets us out of thinking of our problems in isolation or exclusion,
                      and the energy of a group supports collective and individual healing.
                    </p>
                    <p>
                      For example, did you know that your capacity for professional success is
                      intimately linked to your relationship with your mother? When such a theme
                      is explored, it unravels seemingly unrelated areas that have been shaping
                      your life.
                    </p>
                  </div>
                  <div className="mb-4 text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-2 font-medium">What to Expect:</p>
                    <ul className="list-inside list-disc">
                      <li>Supportive, sacred space for reflection and learning</li>
                      <li>Opportunity for participation</li>
                      <li>Possibility of having our concern addressed</li>
                    </ul>
                  </div>
                  <Button
                    text="View Upcoming Immersions"
                    href="#"
                    mode="dark"
                    colors={{
                      fg: '#9ac1bf',
                      fgHover: '#354443',
                      bgHover: '#9ac1bf',
                    }}
                  />
                </div>
              </div>

              {/* Card 3: Trainings */}
              <div className="relative flex h-[763px] items-end overflow-hidden rounded-[36px] border-[16px] border-[#9ac1bf] p-10">
                <div className="absolute inset-0 -z-10">
                  <img
                    src="/Trainings.webp"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="w-full max-w-[640px] rounded-[24px] bg-[rgba(53,68,67,0.8)] p-5 backdrop-blur-sm">
                  <h3
                    className="mb-4 text-[48px] leading-normal text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-saphira), serif' }}
                  >
                    Trainings
                  </h3>
                  <p
                    className="mb-4 text-[24px] uppercase leading-normal tracking-[3.84px] text-[#9ac1bf]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                  >
                    For Becoming Your Own Healer
                  </p>
                  <div className="mb-4 text-justify text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-4">
                      With all the self-work you have undertaken (hopefully), you may feel ready
                      to take ownership for your own wellbeing – physical, mental and spiritual.
                      Further, you may even feel called to be the light in someone else's journey
                      - creating new opportunities to earn through this work. This is where
                      training comes in. Trainings are an opportunity to deepen your connection
                      with your body-mind-soul; acquire a skill that makes you independent with
                      yourself; learn about holding space for another etc.
                    </p>
                    <p>
                      Trainings with me have deep focus on self-growth and awareness because a
                      healer is not only proficient in skill, but also is an individual who is
                      deeply comfortable with their own light and dark sides.
                    </p>
                  </div>
                  <div className="mb-4 text-[12px] leading-normal text-[#9ac1bf]">
                    <p className="mb-2 font-medium">What to Expect:</p>
                    <ul className="list-inside list-disc">
                      <li>Self-growth and work</li>
                      <li>Theory of the modality</li>
                      <li>Application of the modality & Practice Sessions</li>
                    </ul>
                  </div>
                  <Button
                    text="Explore Training Programs"
                    href="#"
                    mode="dark"
                    colors={{
                      fg: '#9ac1bf',
                      fgHover: '#354443',
                      bgHover: '#9ac1bf',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Thoughts & Ponderings Section */}
        <Section id="thoughts" className="relative z-10 w-full bg-[#f6edd0] px-8 py-20">
          <div className="mx-auto flex max-w-[1349px] flex-col items-center gap-10">
            <h2
              className="text-center text-[48px] leading-normal text-[#354443]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              Thoughts & Ponderings
            </h2>
            <p
              className="text-center text-[24px] uppercase leading-normal tracking-[3.84px] text-[#354443]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              A wall of my current thoughts & ponderings
            </p>

            {/* Grid of thought cards - text only */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Row 1 */}
              <div className="flex min-h-[200px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="flex min-h-[200px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="row-span-2 flex min-h-[416px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>

              {/* Row 2 */}
              <div className="flex min-h-[200px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
              <div className="flex min-h-[200px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>

              {/* Row 3 */}
              <div className="col-start-3 flex min-h-[200px] items-center justify-center rounded-[24px] bg-[#9ac1bf] p-10 lg:col-start-3">
                <p
                  className="text-center text-[24px] leading-normal text-[#354443]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  This is a thought card with some text
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section id="approach-cta" className="relative z-10 w-full bg-[#f6edd0] px-8 py-20">
          <div className="mx-auto flex max-w-[1349px] flex-col items-center gap-6 text-center">
            {/* Decorative blob */}
            <div className="mb-4">
              <PageEndBlob color="#9ac1bf" className="h-auto w-[163px]" />
            </div>

            <p
              className="max-w-[799px] text-[48px] leading-normal text-[#9ac1bf]"
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
