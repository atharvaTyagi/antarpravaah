'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';
import Button from './Button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const journeySteps = [
  {
    title: 'Human life is a gift.',
    body: 'It is said, it takes 84 lac lives to get to a human birth. And each life is a play between light and shadow; love and loss; joy and pain. Each life, a discovery and an exploration of our self-realised selves lost under layers of complex experiences. This is the point of life.',
    alignment: 'left' as const,
  },
  {
    title: 'Easier said than done? I get it.',
    body: 'I have been there. It can be overwhelming, the hard moments - as if they\'ll never end or that you\'re walking through them alone. Or you are the only one they are happening too. An endless list of \'Why\' with no answers. But those moments aren\'t the end; they\'re a beginning. They\'re the soul\'s call for renewal, an invitation to remember your strength, your truth, and the support that surrounds you.',
    alignment: 'right' as const,
  },
  {
    title: 'And it is here that avenues for healing fit in.',
    body: 'Healing is a remembrance. It\'s not about living happily ever after — it\'s about living happily regardless. Authentic healing helps you meet life as it is, with compassion, courage, and presence.',
    alignment: 'left' as const,
  },
  {
    title: 'The journey I offer is not a quick fix. It is soul work.',
    body: 'It\'s deep, honest, sometimes uncomfortable — and profoundly transformative. In this space, we explore what it means to come home to yourself — to embrace every part of who you are, even the ones you\'ve hidden or judged. Because peace isn\'t found in perfection. It\'s found in wholeness.',
    alignment: 'right' as const,
  },
];

// Original path data from journey_step.svg
const JOURNEY_PATH = "M173.635 95.4484C151.494 97.7835 129.473 100.841 107.173 100.459C77.6762 99.9523 40.6473 66.8241 36.7986 37.2857C35.4874 27.1965 37.8259 17.0147 40.4721 7.18942C40.9709 5.31318 41.444 3.15384 40.3419 1.55936C38.5631 -1.01032 34.5789 0.0549134 31.8074 1.48525C22.2351 6.43608 13.1436 12.8906 7.10457 21.8138C-5.8487 40.9813 0.599598 69.3141 12.9403 87.0322C37.5729 122.404 77.3362 135.688 118.583 137.219C153.362 138.511 187.968 132.745 222.297 126.997C246.109 123.009 269.921 119.021 293.733 115.033C311.723 112.022 329.827 108.998 348.062 109.179C365.074 109.34 388.961 112.382 403.261 121.831C421.096 133.598 433.749 154.162 443.296 172.744C445.809 177.633 454.082 204.484 458.46 205.862C464.749 207.846 460.782 183.242 460.344 179.497C455.324 135.543 435.864 94.6478 389.272 84.1137C347.273 74.6203 306.669 80.6407 264.808 86.3663C238.426 89.9763 211.861 91.9723 185.342 94.3152C181.436 94.6599 177.543 95.0472 173.649 95.4627L173.635 95.4484Z";

// SVG connector using the original path shape with clip-path reveal animation
const ConnectorPath = ({ flip, clipId }: { flip: boolean; clipId: string }) => (
  <svg
    className="journey-connector-svg w-full h-auto"
    viewBox="0 0 462 206"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
  >
    <defs>
      {/* Clip rect for reveal animation - width animated via GSAP */}
      <clipPath id={clipId}>
        <rect className="clip-rect" x="0" y="0" width="0" height="206" />
      </clipPath>
    </defs>
    {/* Animated foreground path - revealed via clip-path */}
    <path
      d={JOURNEY_PATH}
      fill="#9AC1BF"
      clipPath={`url(#${clipId})`}
    />
  </svg>
);

export default function TheJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const connectorRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const stepsContainer = stepsContainerRef.current;
    if (!section || !stepsContainer) return;
    const initTimeout = setTimeout(() => {
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      const connectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];

      // Explicitly set clip rects to width 0 to ensure shapes start hidden
      connectors.forEach((connector) => {
        const clipRect = connector.querySelector('.clip-rect');
        if (clipRect) {
          gsap.set(clipRect, { attr: { width: 0 } });
        }
      });

      // Initialize steps as hidden
      steps.forEach((step) => {
        gsap.set(step, { opacity: 0, y: 50 });
      });

      // Create individual ScrollTriggers for each step and connector
      // Each element animates when it enters the viewport
      steps.forEach((step, index) => {
        // Animate text when it comes into view
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%', // Start when element is 85% down the viewport
              end: 'top 40%',
              scrub: 1,
            },
          }
        );
      });

      // Animate connectors (clip-path reveal) - faster animation
      connectors.forEach((connector) => {
        const clipRect = connector.querySelector('.clip-rect');
        if (!clipRect) return;

        // Keep connector fully hidden until user scrolls further down the page.
        // (If start is too low like '85%', it may already be "past start" on initial load.)
        gsap.fromTo(
          clipRect,
          { attr: { width: 0 } },
          {
            attr: { width: 462 },
            ease: 'power1.out',
            scrollTrigger: {
              trigger: connector,
              start: 'top 55%',
              end: 'top 25%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <Section
      id="journey"
      className="relative w-full bg-[#f6edd0] pb-16 sm:pb-20 lg:pb-24 pt-[60px] sm:pt-[76px] lg:pt-[96px]"
      ref={sectionRef}
    >
      <div ref={stepsContainerRef} className="mx-auto max-w-full sm:max-w-[calc(100vw-64px)] lg:max-w-[1177px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        {/* Journey steps with animated connectors */}
        <div className="mx-auto w-full max-w-full sm:max-w-[calc(100vw-80px)] lg:max-w-[1097px] py-6 sm:py-8 lg:py-10 flex flex-col items-center justify-center">
          {journeySteps.map((step, index) => {
            const isRight = step.alignment === 'right';
            const hasConnector = index < journeySteps.length - 1;

            return (
              <div key={index} className="w-full">
                {/* Text content */}
                <div className={`flex w-full justify-center ${isRight ? 'lg:justify-end' : 'lg:justify-start'}`}>
                  <div
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    className="w-full sm:w-[280px] lg:w-[320px] text-justify journey-step px-2 sm:px-0"
                    style={{ opacity: 0 }}
                  >
                    <p
                      className="text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#9ac1bf]"
                      style={{ fontFamily: 'var(--font-saphira), serif' }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-1.5 sm:mt-2 text-[11px] sm:text-[11.5px] lg:text-[12px] leading-relaxed text-[#354443]"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>

                {/* Animated connector SVG - with extra vertical spacing for scroll room */}
                {hasConnector && (
                  <div
                    ref={(el) => {
                      connectorRefs.current[index] = el;
                    }}
                    className="mx-auto my-8 sm:my-12 lg:my-16 w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[462px] journey-connector min-h-[180px] sm:min-h-[200px] lg:min-h-[250px]"
                  >
                    <ConnectorPath flip={index % 2 !== 0} clipId={`connector-clip-${index}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-10 sm:mt-12 lg:mt-16 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#9ac1bf] p-6 sm:p-8 lg:p-10 text-center">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <p
              className="mb-3 sm:mb-3.5 lg:mb-4 text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#354443]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              If you&apos;re ready
            </p>
            <p
              className="mb-3 sm:mb-3.5 lg:mb-4 text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#354443]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              to stop searching
            </p>
            <p
              className="mb-3 sm:mb-3.5 lg:mb-4 text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#354443]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              outside yourself
            </p>
            <p
              className="mb-3 sm:mb-3.5 lg:mb-4 text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#354443]"
              style={{ fontFamily: 'var(--font-saphira), serif' }}
            >
              for answers...
            </p>
          </div>
          <p
            className="mb-6 sm:mb-8 lg:mb-10 text-[28px] sm:text-[38px] lg:text-[48px] leading-[1.1] sm:leading-[1.05] lg:leading-[1.0] text-[#354443]"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            You&apos;re in the right place.
          </p>
          <Button
            text="Begin Your Journey"
            size="large"
            mode="dark"
            onClick={() => {
              // Handle button click
            }}
          />
        </div>
      </div>
    </Section>
  );
}
