'use client';

import Section from '@/components/Section';
import Button from '@/components/Button';
import PageEndBlob from '@/components/PageEndBlob';
import FadeInImage from '@/components/FadeInImage';
import { getCloudinaryUrl } from '@/lib/cloudinary';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 w-full pt-[90px] sm:pt-[108px] lg:pt-[148px]">
        {/* ===== SECTION 1: Introduction ===== */}
        <Section id="about-intro" className="about-section w-full bg-[#f6edd0] pb-16 sm:pb-20 lg:pb-24">
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
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 500 }}
              >
                Founder of Antar Pravaah | Healer &amp; Facilitator | Host at Aalayam, Himachal Pradesh
              </p>
            </div>
          </div>
        </Section>

        {/* ===== SECTION 2: Photos & Blob - Green Band ===== */}
        <Section id="about-body" className="about-section w-full bg-[#474e3a]">
          {/* Photo row 1 - overlaps from cream section */}
          <div className="relative z-10 -mt-[60px] sm:-mt-[80px] lg:-mt-[100px] flex flex-col items-center justify-center gap-4 sm:gap-6 md:flex-row md:items-end md:gap-8 lg:gap-10 px-4">
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

          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src="/about_dashed_background.svg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          {/* Blob with text */}
          <div className="relative mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
            <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-14">
              <div className="relative flex w-full justify-center">
                {/* Text blob shape container */}
                <div className="relative flex items-center justify-center">
                  {/* Background SVG shape - responsive sizing */}
                  <img
                    src="/about_text_blob.svg"
                    alt=""
                    className="w-[400px] sm:w-[520px] md:w-[580px] lg:w-[640px] h-auto"
                  />
                  {/* Text content overlay - absolutely positioned inside the blob */}
                  <div className="absolute inset-0 flex items-center justify-center px-10 sm:px-14 md:px-16 lg:px-20 py-10 md:py-14 lg:py-16">
                    <div className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] text-justify text-[#474e3a]">
                      <p
                        className="text-[10px] sm:text-[11px] md:text-[12px] leading-relaxed"
                        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                      >
                        I have had the privilege of guiding hundreds of people across all ages and backgrounds through pain, trauma, grief, relationship struggles, fear, and more. The transformations are countless, yet the heart of the work is always the same: facilitating a remembrance back to themselves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo row 2 */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
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
        </Section>

        {/* ===== SECTION 3: My Inspiration ===== */}
        <Section 
          id="inspiration" 
          className="about-section w-full min-h-screen bg-[#f6edd0] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20"
        >
          <div 
            className="w-full max-w-[1097px] bg-[#93a378] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16"
          >
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 items-center justify-center text-[#474e3a] text-center">
              <h2
                className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.0]"
                style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
              >
                My inspiration
              </h2>
              
              <div 
                className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px] space-y-4 sm:space-y-5"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                <p>
                  This work is not mine alone. I would not be here were it not for the Grace, guidance and support of my Guru and the lineage of the tradition of which I am a part.
                </p>
                <p>
                  <a 
                    href="http://www.rikhiapeeth.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium hover:opacity-80 transition-opacity"
                  >
                    http://www.rikhiapeeth.in
                  </a>
                  <br />
                  <a 
                    href="https://www.biharyoga.net/index.php" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium hover:opacity-80 transition-opacity"
                  >
                    https://www.biharyoga.net/index.php
                  </a>
                </p>
                <p>
                  With stalwarts like Swami Sivananda Saraswati, Swami Satyananda Saraswati, Swami Niranjananda Saraswati and Swami Satyasangananda Saraswati lighting the path, I am left only to walk in their footsteps. It changed my life. The work is theirs, I am merely the face of it.
                </p>
                <p>
                  My teachers whose enlightened minds, passion, zeal and spirit of seva drive me every single day to show up. Namita Unnikrishnan, Dr. BN Jha, Dr. H Bhojraj, Urmimala Deb, Ritu Kabra, Marina Toledo, Dain Heer, Gary Douglas and the countless people who walked through my door trusting me with their body, mind and soul. I am grateful. So grateful.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== SECTION 4: CTA ===== */}
        <Section id="about-cta" className="about-section w-full bg-[#f6edd0] py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6 py-6 sm:py-8 lg:py-10">
              <div className="flex items-center justify-center py-3 sm:py-4 lg:py-5">
                <PageEndBlob color="#474e3a" className="h-8 sm:h-9 lg:h-10 w-auto opacity-60" />
              </div>
              <p
                className="max-w-full sm:max-w-[680px] lg:max-w-[799px] text-center text-[28px] sm:text-[32px] lg:text-[36px] leading-[normal] text-[#93a378] px-4"
                style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
              >
                Whatever you carry, you&apos;re not alone.
              </p>
              <Button
                text="Begin Your Journey"
                size="large"
                colors={{ fg: '#474e3a', fgHover: '#93a378', bgHover: '#474e3a' }}
                href="/contact"
              />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
