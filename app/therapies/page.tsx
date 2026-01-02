'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Section from '@/components/Section';
import TherapiesCardStack from '@/components/TherapiesCardStack';
import TherapyCard from '@/components/TherapyCard';
import Button from '@/components/Button';
import { therapies } from '@/data/therapiesContent';

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',      // Dark brown text in non-hovered state
  fgHover: '#d6c68e', // Light gold text on hover
  bgHover: '#645c42', // Dark brown background on hover
};

export default function TherapiesPage() {
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

    // Store Lenis instance globally so Observer can control it
    (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Get Antar Smaran Process (last in array) for featured section
  const antarSmaranProcess = therapies.find((t) => t.id === 'antar-smaran-process');

  // Get all other therapies for the modalities section (excluding ASP)
  const modalityTherapies = therapies.filter((t) => t.id !== 'antar-smaran-process');

  // Prepare cards for the sticky stack
  const therapyCards = modalityTherapies.map((therapy) => ({
    key: therapy.id,
    render: <TherapyCard therapy={therapy} />,
  }));

  return (
    <main className="min-h-screen bg-[#f6edd0] relative">

      {/* Introduction Section */}
      <Section
        id="therapies-intro"
        className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center px-8 pt-[200px] pb-24"
      >
        <div className="max-w-[723px] mx-auto text-center flex flex-col gap-5">
          <h1
            className="text-[48px] leading-normal text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Therapies
          </h1>
          <p
            className="text-[24px] leading-normal text-[#645c42] uppercase tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Possibilities for Change
          </p>
          <div
            className="text-[#645c42] text-[12px] leading-normal text-justify"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            <p className="mb-4">
              Combining bodywork and energy healing modalities opens powerful possibilities for
              healing—from acute and chronic illnesses to pain management, trauma release, and
              recovery from abuse. These therapies support the transformation of patterns related to
              loss, help dissolve blocks in relationships, assist in post-accident or post-surgical
              integration, and bring awareness to inherited family dynamics that may still be
              influencing your life.
            </p>
            <p>
              Each session at Antar Pravaah is designed to meet you where you are, using natural
              healing practices to support deep, lasting change.
            </p>
          </div>
        </div>
      </Section>

      {/* Antar Smaran Process - Featured Section */}
      {antarSmaranProcess && (
        <Section
          id="therapies-asp"
          className="relative z-10 w-full px-8 pb-24"
        >
          <div className="max-w-[1347px] mx-auto">
            <TherapyCard therapy={antarSmaranProcess} />
          </div>
        </Section>
      )}

      {/* Modalities Section with GSAP Observer Card Stack */}
      <Section id="therapies-modalities" className="relative z-10 w-full px-8 pb-8">
        <div className="max-w-[1347px] mx-auto">
          <TherapiesCardStack cards={therapyCards} title="Our Modalities" />
        </div>
      </Section>

      {/* Not Sure Section */}
      <Section
        id="therapies-not-sure"
        className="relative z-10 flex flex-col items-center justify-center px-8 pt-16 pb-24"
      >
        <div className="max-w-[1347px] mx-auto flex flex-col items-center gap-10 text-center">
          <h2
            className="text-[48px] leading-normal text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Not sure which therapy is right for you?
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center py-5">
            <img 
              src="/page_end_blob.svg" 
              alt="" 
              className="w-[163px] h-auto"
              style={{
                filter: 'brightness(0) saturate(100%) invert(83%) sepia(15%) saturate(630%) hue-rotate(7deg) brightness(95%) contrast(85%)'
              }}
            />
          </div>

          <p
            className="text-[24px] leading-normal text-[#645c42] uppercase tracking-[3.84px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Find your path
          </p>

          <p
            className="text-[24px] leading-normal text-[#645c42] max-w-[687px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Every body speaks a different language. If you're unsure which modality will resonate
            most deeply with you, we offer a complimentary 30-minute consultation to help guide you
            to the therapy that will serve your healing journey best.
          </p>

          <div className="flex flex-col gap-3">
            <Button text="Schedule a Free Consultation" size="large" colors={therapiesButtonColors} />
          </div>
        </div>
      </Section>

      {/* Come and Find Me Section */}
      <Section
        id="therapies-come-find-me"
        className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center px-8 py-24"
      >
        <div className="max-w-[1347px] mx-auto flex flex-col items-center gap-16">
          {/* Blob with text inside */}
          <div className="relative flex items-center justify-center">
            {/* Background blob - using about_text_blob.svg */}
            <img
              src="/about_text_blob.svg"
              alt=""
              className="w-[640px] md:w-[800px] lg:w-[900px] h-auto"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)'
              }}
            />

            {/* Content positioned inside the blob */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-12 md:px-20 lg:px-28 py-16">
              <div className="text-center flex flex-col gap-4 max-w-[500px] lg:max-w-[580px]">
                <h2
                  className="text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-[#645c42]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  Come and find me....
                </h2>

                <div
                  className="text-[14px] md:text-[18px] lg:text-[20px] leading-relaxed text-[#645c42]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  <p className="mb-1">Find me when you have lost track of your path,</p>
                  <p className="mb-1">When you have forgotten what you like and dislike,</p>
                  <p className="mb-1">
                    When you are bored of always seeking people to fill the emptiness you feel within,
                  </p>
                  <p className="mb-1">When your body hurts and you can't take it no more,</p>
                  <p className="mb-1">When you feel purposeless and joyless,</p>
                  <p className="mb-1">When this life seems alien,</p>
                  <p className="mb-1">When dealing with others drains your energy,</p>
                  <p className="mb-1">
                    When you cannot see the light in others and only the dark in yourself,
                  </p>
                  <p className="mb-1">Find me when no answer is good enough,</p>
                  <p>
                    When you have been to enough people seeking to get clarity about your life,
                  </p>
                </div>

                <h2
                  className="text-[28px] md:text-[36px] lg:text-[42px] leading-tight text-[#645c42] mt-4"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  Find me when you are ready to find yourself.
                </h2>
              </div>
            </div>
          </div>

          {/* CTA buttons below the blob */}
          <div className="flex flex-col gap-3 items-center">
            <Button text="Book your first session" size="large" colors={therapiesButtonColors} />
            <Button text="Schedule a Free Consultation" size="small" colors={therapiesButtonColors} />
          </div>
        </div>
      </Section>
    </main>
  );
}
