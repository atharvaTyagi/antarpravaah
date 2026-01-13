'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import FadeInImage from '@/components/FadeInImage';
import { getCloudinaryUrl } from '@/lib/cloudinary';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const hiRef = useRef<HTMLParagraphElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const blobTextContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Native scroll; no smooth scroll library needed
  }, []);

  // Text fade-in animation
  useEffect(() => {
    if (!hiRef.current || !blobTextContainerRef.current) return;

    const validParagraphs = paragraphRefs.current.filter((p) => p !== null);
    if (validParagraphs.length === 0) return;

    // Set initial state - everything invisible
    gsap.set([hiRef.current, ...validParagraphs], {
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

    // Animate "Hi!" first
    tl.to(hiRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    });

    // Then animate each paragraph with stagger
    tl.to(
      validParagraphs,
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.4,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);



  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 w-full pt-[90px] sm:pt-[108px] lg:pt-[148px]">
        <Section id="about" className="w-full bg-[#f6edd0] pb-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
            <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] py-6 sm:py-8 lg:py-10">
              {/* Top mark */}
              <div className="w-[40%] sm:w-[30%] lg:w-[241px] max-w-[241px]">
                <img
                  src="/about_splash_vector.svg"
                  alt=""
                  className="block w-full h-auto object-contain"
                />
              </div>

              <h1
                className="text-center text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.0] text-[#93a378]"
                style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
              >
                About Namita
              </h1>

              <p
                className="text-center text-[16px] sm:text-[20px] lg:text-[24px] leading-[normal] text-[#474e3a] px-4 max-w-[680px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Founder of Antar Pravaah | Healer &amp; Facilitator | Host at Aalayam, Himachal Pradesh
              </p>

              {/* Photo row 1 (Figma sizes) — overlaps into the green band slightly */}
              <div className="relative z-10 -mb-[80px] sm:-mb-[100px] lg:-mb-[140px] flex flex-col items-center justify-center gap-4 sm:gap-6 md:flex-row md:items-end md:gap-8 lg:gap-10">
                <div className="h-[200px] w-[192px] sm:h-[240px] sm:w-[230px] lg:h-[289px] lg:w-[276px] overflow-hidden rounded-full">
                  <FadeInImage 
                    src={getCloudinaryUrl('antarpravaah/about/namita_one')} 
                    alt="Namita" 
                    width={276} 
                    height={289}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div className="h-[290px] w-[277px] sm:h-[350px] sm:w-[334px] lg:h-[419px] lg:w-[400px] overflow-hidden rounded-full">
                  <FadeInImage 
                    src={getCloudinaryUrl('antarpravaah/about/namita_two')} 
                    alt="Namita" 
                    width={400} 
                    height={419}
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div className="h-[162px] w-[154px] sm:h-[194px] sm:w-[185px] lg:h-[233px] lg:w-[222px] overflow-hidden rounded-full">
                  <FadeInImage 
                    src={getCloudinaryUrl('antarpravaah/about/namita_three')} 
                    alt="Namita" 
                    width={222} 
                    height={233}
                    className="h-full w-full object-cover" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deep green band with swirl + body circle */}
          <div className="relative w-full bg-[#474e3a] pt-[120px] sm:pt-[150px] lg:pt-[200px] pb-16 sm:pb-20 lg:pb-24">
            {}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                src="/about_dashed_background.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-14">
                <div className="relative flex w-full justify-center">
                  {/* Text blob shape container */}
                  <div className="relative flex items-center justify-center" ref={blobTextContainerRef}>
                    {/* Background SVG shape - responsive sizing */}
                    <img
                      src="/about_text_blob.svg"
                      alt=""
                      className="w-[500px] sm:w-[600px] md:w-[700px] lg:w-[800px] h-auto"
                    />
                    {/* Text content overlay - absolutely positioned inside the blob */}
                    <div className="absolute inset-0 flex items-center justify-center px-12 sm:px-16 md:px-20 lg:px-24 py-12 md:py-16 lg:py-20">
                      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] text-justify text-[#474e3a]">
                        <p
                          ref={hiRef}
                          className="mb-2 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-normal"
                          style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                        >
                          Hi !
                        </p>
                        <div
                          className="space-y-2 sm:space-y-2.5 md:space-y-3 text-[10px] sm:text-[11px] md:text-[12px] leading-relaxed"
                          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                        >
                          <p ref={(el) => { paragraphRefs.current[0] = el; }}>
                            I'm Namita, a healer and facilitator with decades of experience guiding people through
                            life's physical, emotional, and energetic challenges. My journey began over twenty years ago
                            in Public Relations, but a quiet inner calling led me to explore paths far beyond the
                            ordinary—editing books, creating events, building ventures, and even running a home bakery.
                            Each experience deepened my understanding of people, life, and the subtle energies that
                            connect us all.
                          </p>
                          <p ref={(el) => { paragraphRefs.current[1] = el; }}>
                            The turning point came when I discovered Foot Reflexology. Following my intuition led me
                            into a world of healing I hadn't anticipated, and over time, new modalities found
                            me—each one expanding my understanding of energy, the body, and transformation. Today, I
                            bring experience in Sujok, Acupuncture and Auricular Therapy, Access Bars &amp; Body
                            Processes, Access Energetic Facelift, Systemic Family Constellation Therapy, Shamanism,
                            Transpersonal Regression Therapy, Transcendental Healing, and more.
                          </p>
                          <p ref={(el) => { paragraphRefs.current[2] = el; }}>
                            I have had the privilege of guiding hundreds of people across all ages and backgrounds
                            through pain, trauma, grief, relationship struggles, fear, and more. The transformations are
                            countless, yet the heart of the work is always the same: facilitating a remembrance back to
                            themselves.
                          </p>
                          <p ref={(el) => { paragraphRefs.current[3] = el; }}>
                            My work transcends any single technique. It is rooted in presence, intuition, and decades of
                            inner practice. When we work together, you are not just learning a modality—you are
                            reconnecting with yourself. You'll leave with clarity, presence, and the possibility that
                            comes from remembering the wholeness you've always carried.
                          </p>
                          <p ref={(el) => { paragraphRefs.current[4] = el; }}>
                            Healing, to me, is not fixing—it's remembering. Not escaping—it's embracing. Whatever you
                            carry, you are not alone, and I welcome you to this space of transformation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo row 2 (Figma sizes) — slightly spills out of the green band */}
                <div className="relative z-10 -mb-[90px] sm:-mb-[120px] lg:-mb-[160px] flex flex-col items-center justify-center gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
                  <div className="h-[185px] w-[176px] sm:h-[222px] sm:w-[212px] lg:h-[266px] lg:w-[254px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_four')} 
                      alt="Namita" 
                      width={254} 
                      height={266}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="h-[290px] w-[277px] sm:h-[350px] sm:w-[334px] lg:h-[419px] lg:w-[400px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_five')} 
                      alt="Namita" 
                      width={400} 
                      height={419}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="h-[227px] w-[217px] sm:h-[273px] sm:w-[260px] lg:h-[327px] lg:w-[312px] overflow-hidden rounded-full">
                    <FadeInImage 
                      src={getCloudinaryUrl('antarpravaah/about/namita_six')} 
                      alt="Namita" 
                      width={312} 
                      height={327}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8 pt-[140px] sm:pt-[180px] lg:pt-[220px]">
            <div className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 py-6 sm:py-8 lg:py-10">
              <div className="flex items-center justify-center py-3 sm:py-4 lg:py-5">
                <PageEndBlob color="#474e3a" className="h-8 sm:h-9 lg:h-10 w-auto opacity-60" />
              </div>
              <p
                className="max-w-full sm:max-w-[680px] lg:max-w-[799px] text-center text-[28px] sm:text-[38px] lg:text-[48px] leading-[normal] text-[#93a378] px-4"
                style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
              >
                If you feel called, I welcome you. Whatever you carry, you&apos;re not alone.
              </p>
              <Button
                text="Begin Your Journey"
                size="small"
                colors={{ fg: '#93a378', fgHover: '#474e3a', bgHover: '#93a378' }}
                href="/#journey"
              />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

