'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import FadeInImage from '@/components/FadeInImage';

export default function AboutPage() {
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
    <main className="relative min-h-screen">
      <div className="relative z-10 w-full pt-[148px]">
        <Section id="about" className="w-full bg-[#f6edd0] pb-24">
          <div className="mx-auto max-w-[1177px] px-8 pt-10">
            <div className="flex flex-col items-center gap-10 rounded-[24px] py-10">
              {/* Top mark (placeholder using existing splash vector asset) */}
              <div className="h-[204px] w-[241px]">
                <img
                  src="/splash_vector.svg"
                  alt=""
                  className="block h-full w-full object-contain opacity-40"
                />
              </div>

              <h1
                className="text-center text-[48px] leading-[1.0] text-[#93a378]"
                style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
              >
                About Namita
              </h1>

              <p
                className="text-center text-[24px] leading-[normal] text-[#474e3a]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Founder of Antar Pravaah | Healer &amp; Facilitator | Host at Aalayam, Himachal Pradesh
              </p>

              {/* Photo row 1 (Figma sizes) — overlaps into the green band slightly */}
              <div className="relative z-10 -mb-[140px] flex flex-col items-center justify-center gap-6 md:flex-row md:items-end md:gap-10">
                <div className="h-[289px] w-[276px] overflow-hidden rounded-full">
                  <FadeInImage src="/namita_one.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="h-[419px] w-[400px] overflow-hidden rounded-full">
                  <FadeInImage src="/namita_two.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="h-[233px] w-[222px] overflow-hidden rounded-full">
                  <FadeInImage src="/namita_three.svg" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Deep green band with swirl + body circle */}
          <div className="relative w-full bg-[#474e3a] pt-[200px] pb-24">
            {}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                src="/about_dashed_background.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative mx-auto max-w-[1177px] px-8">
              <div className="flex flex-col items-center gap-14">
                <div className="relative flex w-full justify-center">
                  <div className="flex h-[640px] w-[640px] max-w-full items-center justify-center rounded-full bg-[#93a378] p-10">
                    <div className="w-[315px] max-w-full text-justify text-[#474e3a]">
                      <p
                        className="mb-2 text-[24px] leading-[normal]"
                        style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                      >
                        Hi !
                      </p>
                      <div
                        className="space-y-3 text-[12px] leading-[normal]"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        <p>
                          I’m Namita, a healer and facilitator with decades of experience guiding people through
                          life’s physical, emotional, and energetic challenges. My journey began over twenty years ago
                          in Public Relations, but a quiet inner calling led me to explore paths far beyond the
                          ordinary—editing books, creating events, building ventures, and even running a home bakery.
                          Each experience deepened my understanding of people, life, and the subtle energies that
                          connect us all.
                        </p>
                        <p>
                          The turning point came when I discovered Foot Reflexology. Following my intuition led me
                          into a world of healing I hadn’t anticipated, and over time, new modalities found
                          me—each one expanding my understanding of energy, the body, and transformation. Today, I
                          bring experience in Sujok, Acupuncture and Auricular Therapy, Access Bars &amp; Body
                          Processes, Access Energetic Facelift, Systemic Family Constellation Therapy, Shamanism,
                          Transpersonal Regression Therapy, Transcendental Healing, and more.
                        </p>
                        <p>
                          I have had the privilege of guiding hundreds of people across all ages and backgrounds
                          through pain, trauma, grief, relationship struggles, fear, and more. The transformations are
                          countless, yet the heart of the work is always the same: facilitating a remembrance back to
                          themselves.
                        </p>
                        <p>
                          My work transcends any single technique. It is rooted in presence, intuition, and decades of
                          inner practice. When we work together, you are not just learning a modality—you are
                          reconnecting with yourself. You’ll leave with clarity, presence, and the possibility that
                          comes from remembering the wholeness you’ve always carried.
                        </p>
                        <p>
                          Healing, to me, is not fixing—it’s remembering. Not escaping—it’s embracing. Whatever you
                          carry, you are not alone, and I welcome you to this space of transformation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo row 2 (Figma sizes) — slightly spills out of the green band */}
                <div className="relative z-10 -mb-[160px] flex flex-col items-center justify-center gap-6 md:flex-row md:items-start md:gap-10">
                  <div className="h-[266px] w-[254px] overflow-hidden rounded-full">
                    <FadeInImage src="/namita_four.svg" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-[419px] w-[400px] overflow-hidden rounded-full">
                    <FadeInImage src="/namita_five.svg" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-[327px] w-[312px] overflow-hidden rounded-full">
                    <FadeInImage src="/namita_six.svg" alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto max-w-[1177px] px-8 pt-[220px]">
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="flex items-center justify-center py-5">
                <PageEndBlob color="#474e3a" className="h-10 w-auto opacity-60" />
              </div>
              <p
                className="max-w-[799px] text-center text-[48px] leading-[normal] text-[#93a378]"
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

