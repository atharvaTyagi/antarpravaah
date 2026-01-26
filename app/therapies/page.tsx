'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '@/components/Section';
import ModalitiesScrollCard, { ModalityContent } from '@/components/ModalitiesScrollCard';
import TherapyCard from '@/components/TherapyCard';
import Button from '@/components/Button';
import { therapies, DescriptionItem } from '@/data/therapiesContent';

gsap.registerPlugin(ScrollTrigger);

// Therapies page button colors matching the page theme
const therapiesButtonColors = {
  fg: '#645c42',      // Dark brown text in non-hovered state
  fgHover: '#d6c68e', // Light gold text on hover
  bgHover: '#645c42', // Dark brown background on hover
};

export default function TherapiesPage() {
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const textLineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const blobTextContainerRef = useRef<HTMLDivElement>(null);

  // Setup GSAP fade transitions between sections
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for DOM to be ready
    const setupTimeout = setTimeout(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.therapies-section');
      if (sections.length === 0) return;

      // Create fade transitions for each section (except first and pinned sections)
      sections.forEach((section, index) => {
        const sectionId = section.id;
        
        // Skip first section - it starts visible
        if (index === 0) {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Skip pinned sections (modalities) - they handle their own visibility
        if (sectionId === 'therapies-modalities') {
          gsap.set(section, { opacity: 1 });
          return;
        }

        // Set initial state - sections start completely invisible
        gsap.set(section, { opacity: 0 });

        // Fade in when section enters viewport (0 to 100%)
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(section, { opacity: self.progress });
          },
        });

        // Fade out the previous section as this one enters (skip if previous is pinned)
        if (index > 0) {
          const prevSection = sections[index - 1];
          const prevSectionId = prevSection.id;
          
          // Don't fade out pinned sections
          if (prevSectionId === 'therapies-modalities') return;
          
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

  // Text fade-in animation for "Come and find me" blob
  useEffect(() => {
    if (!heading1Ref.current || !heading2Ref.current || !blobTextContainerRef.current) return;

    const validLines = textLineRefs.current.filter((p) => p !== null);
    if (validLines.length === 0) return;

    // Set initial state - everything invisible
    gsap.set([heading1Ref.current, ...validLines, heading2Ref.current], {
      opacity: 0,
      y: 20,
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: blobTextContainerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    // Animate first heading "Come and find me...."
    tl.to(heading1Ref.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    });

    // Then animate each line of text with stagger
    tl.to(
      validLines,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.25,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    // Finally animate the closing heading
    tl.to(
      heading2Ref.current,
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Get Antar Smaran Process (last in array) for featured section
  const antarSmaranProcess = therapies.find((t) => t.id === 'antar-smaran-process');

  // Get all other therapies for the modalities section (excluding ASP)
  const modalityTherapies = therapies.filter((t) => t.id !== 'antar-smaran-process');

  // Transform therapies data to ModalityContent format for the scroll card
  const modalitiesContent: ModalityContent[] = modalityTherapies.map((therapy) => {
    // Handle description - can be string or array
    let descriptionArray: string[] = [];
    if (typeof therapy.description === 'string') {
      descriptionArray = [therapy.description];
    } else {
      descriptionArray = therapy.description.map((item) => {
        if (typeof item === 'string') return item;
        // For DescriptionItem, combine heading and text
        const descItem = item as DescriptionItem;
        return `${descItem.heading}: ${descItem.text}`;
      });
    }

    // Split bestFor into two columns
    const midpoint = Math.ceil(therapy.bestFor.length / 2);
    const column1 = therapy.bestFor.slice(0, midpoint);
    const column2 = therapy.bestFor.slice(midpoint);

    return {
      id: therapy.id,
      title: therapy.title,
      subtitle: therapy.subtitle,
      description: descriptionArray,
      bestFor: {
        column1,
        column2,
      },
      sessionDuration: therapy.duration,
      ctaText: therapy.ctaText,
      iconSrc: therapy.icon,
    };
  });

  return (
    <main className="min-h-screen bg-[#f6edd0] relative">

      {/* Section 1: Introduction */}
      <section className="therapies-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-full sm:max-w-[600px] lg:max-w-[723px] mx-auto text-center flex flex-col gap-4 sm:gap-5 lg:gap-6">
          <h1
            className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.0] text-[#645c42]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Therapies
          </h1>
          <p
            className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#645c42] uppercase tracking-[2.5px] sm:tracking-[3px] lg:tracking-[2.56px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Possibilities for Change
          </p>
          <div
            className="text-[#645c42] text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-center px-2"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            <p className="mb-3 sm:mb-4">
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
      </section>

      {/* Section 2: Antar Smaran Process - Featured Card */}
      {antarSmaranProcess && (
        <section className="therapies-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1347px] mx-auto w-full">
            <TherapyCard therapy={antarSmaranProcess} />
          </div>
        </section>
      )}

      {/* Section 3: Modalities Scroll Card */}
      <Section id="therapies-modalities" className="therapies-section relative z-10 w-full pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <ModalitiesScrollCard modalities={modalitiesContent} sectionTitle="Our Modalities" />
        </div>
      </Section>

      {/* Section 4: Not Sure + Find Your Path + CTA */}
      <section className="therapies-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[800px] mx-auto flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
          {/* Decorative divider at top */}
          <div className="flex items-center justify-center">
            <img 
              src="/page_end_blob.svg" 
              alt="" 
              className="w-[100px] sm:w-[120px] lg:w-[140px] h-auto"
              style={{
                filter: 'brightness(0) saturate(100%) invert(83%) sepia(15%) saturate(630%) hue-rotate(7deg) brightness(95%) contrast(85%)'
              }}
            />
          </div>

          <h2
            className="text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.0] text-[#645c42] px-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Not sure which therapy is right for you?
          </h2>

          <p
            className="text-[14px] sm:text-[15px] lg:text-[16px] leading-normal text-[#645c42] uppercase tracking-[2px] sm:tracking-[2.3px] lg:tracking-[2.56px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Find your path
          </p>

          <p
            className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] text-[#645c42] max-w-full sm:max-w-[550px] lg:max-w-[640px] px-4"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
          >
            Every body speaks a different language. If you're unsure which modality will resonate
            most deeply with you, we offer a complimentary 30-minute consultation to help guide you
            to the therapy that will serve your healing journey best.
          </p>

          <div className="flex flex-col gap-2 sm:gap-3 mt-2">
            <Button text="Schedule a Free Consultation" size="large" colors={therapiesButtonColors} />
          </div>
        </div>
      </section>

      {/* Section 5: Come and Find Me - Big Blob */}
      <section className="therapies-section relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1347px] mx-auto flex flex-col items-center gap-10 sm:gap-12 lg:gap-16">
          {/* Blob with text inside */}
          <div className="relative flex items-center justify-center" ref={blobTextContainerRef}>
            {/* Background blob - using about_text_blob.svg */}
            <img
              src="/about_text_blob.svg"
              alt=""
              className="w-[340px] sm:w-[540px] md:w-[700px] lg:w-[900px] h-auto"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(87%) sepia(11%) saturate(939%) hue-rotate(7deg) brightness(102%) contrast(85%)'
              }}
            />

            {/* Content positioned inside the blob */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-12 md:px-16 lg:px-28 py-10 sm:py-12 lg:py-16">
              <div className="text-center flex flex-col gap-3 sm:gap-4 max-w-[280px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px]">
                <h2
                  ref={heading1Ref}
                  className="text-[24px] sm:text-[32px] md:text-[38px] lg:text-[48px] leading-tight text-[#645c42]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  Come and find me....
                </h2>

                <div
                  className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[20px] leading-relaxed text-[#645c42]"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  <p className="mb-1" ref={(el) => { textLineRefs.current[0] = el; }}>Find me when you have lost track of your path,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[1] = el; }}>When you have forgotten what you like and dislike,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[2] = el; }}>
                    When you are bored of always seeking people to fill the emptiness you feel within,
                  </p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[3] = el; }}>When your body hurts and you can't take it no more,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[4] = el; }}>When you feel purposeless and joyless,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[5] = el; }}>When this life seems alien,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[6] = el; }}>When dealing with others drains your energy,</p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[7] = el; }}>
                    When you cannot see the light in others and only the dark in yourself,
                  </p>
                  <p className="mb-1" ref={(el) => { textLineRefs.current[8] = el; }}>Find me when no answer is good enough,</p>
                  <p ref={(el) => { textLineRefs.current[9] = el; }}>
                    When you have been to enough people seeking to get clarity about your life,
                  </p>
                </div>

                <h2
                  ref={heading2Ref}
                  className="text-[22px] sm:text-[28px] md:text-[34px] lg:text-[42px] leading-tight text-[#645c42] mt-3 sm:mt-4"
                  style={{ fontFamily: 'var(--font-saphira), serif' }}
                >
                  Find me when you are ready to find yourself.
                </h2>
              </div>
            </div>
          </div>

          {/* CTA buttons below the blob */}
          <div className="flex flex-col gap-2 sm:gap-3 items-center">
            <Button text="Book your first session" size="large" colors={therapiesButtonColors} />
            <Button text="Schedule a Free Consultation" size="small" colors={therapiesButtonColors} />
          </div>
        </div>
      </section>
    </main>
  );
}
