'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/dist/Observer';

const aboutParagraphs = [
  "I'm Namita, a healer and facilitator with decades of experience guiding people through life's physical, emotional, and energetic challenges. My journey began over twenty years ago in Public Relations, but a quiet inner calling led me to explore paths far beyond the ordinary—editing books, creating events, building ventures, and even running a home bakery. Each experience deepened my understanding of people, life, and the subtle energies that connect us all.",
  
  "The turning point came when I discovered Foot Reflexology. Following my intuition led me into a world of healing I hadn't anticipated, and over time, new modalities found me—each one expanding my understanding of energy, the body, and transformation. Today, I bring experience in Sujok, Acupuncture and Auricular Therapy, Access Bars & Body Processes, Access Energetic Facelift, Systemic Family Constellation Therapy, Shamanism, Transpersonal Regression Therapy, Transcendental Healing, and more.",
  
  "I have had the privilege of guiding hundreds of people across all ages and backgrounds through pain, trauma, grief, relationship struggles, fear, and more. The transformations are countless, yet the heart of the work is always the same: facilitating a remembrance back to themselves.",
  
  "My work transcends any single technique. It is rooted in presence, intuition, and decades of inner practice. When we work together, you are not just learning a modality—you are reconnecting with yourself. You'll leave with clarity, presence, and the possibility that comes from remembering the wholeness you've always carried.",
  
  "Healing, to me, is not fixing—it's remembering. Not escaping—it's embracing. Whatever you carry, you are not alone, and I welcome you to this space of transformation."
];

export default function AboutBlobScroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const blobContainerRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;

    gsap.registerPlugin(ScrollTrigger, Observer);

    const section = sectionRef.current;
    const blobContainer = blobContainerRef.current;
    if (!section || !blobContainer) return;

    const paragraphs = Array.from(blobContainer.querySelectorAll<HTMLElement>('.paragraph-item'));
    if (paragraphs.length === 0) return;

    const time = 0.6;
    let animating = false;

    // Initialize: show first paragraph, hide others
    gsap.set(paragraphs, { autoAlpha: 0, y: 20 });
    gsap.set(paragraphs[0], { autoAlpha: 1, y: 0 });

    const animateToIndex = (newIndex: number) => {
      if (newIndex < 0 || newIndex >= paragraphs.length) return;
      if (animating) return;
      
      const currentIndex = activeIndexRef.current;
      if (newIndex === currentIndex) return;

      animating = true;
      const isForward = newIndex > currentIndex;
      const currentPara = paragraphs[currentIndex];
      const nextPara = paragraphs[newIndex];

      const tl = gsap.timeline({
        onComplete: () => {
          animating = false;
          activeIndexRef.current = newIndex;
        }
      });

      // Fade out current paragraph
      tl.to(currentPara, {
        autoAlpha: 0,
        y: isForward ? -20 : 20,
        duration: time * 0.5,
        ease: 'power2.inOut',
      });

      // Fade in next paragraph
      tl.fromTo(
        nextPara,
        { autoAlpha: 0, y: isForward ? 20 : -20 },
        { autoAlpha: 1, y: 0, duration: time * 0.5, ease: 'power2.out' },
        '-=0.1'
      );
    };

    const handleScroll = (direction: 'up' | 'down') => {
      const currentIndex = activeIndexRef.current;
      
      if (direction === 'down') {
        if (currentIndex < paragraphs.length - 1) {
          animateToIndex(currentIndex + 1);
        } else {
          // At the end, release scroll
          blobObserver.disable();
        }
      } else {
        if (currentIndex > 0) {
          animateToIndex(currentIndex - 1);
        } else {
          // At the start, release scroll
          blobObserver.disable();
        }
      }
    };

    const blobObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
      onEnable(self) {
        const savedScroll = self.scrollY();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (self as any)._restoreScroll = () => self.scrollY(savedScroll);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.addEventListener('scroll', (self as any)._restoreScroll, { passive: false });
      },
      onDisable(self) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.removeEventListener('scroll', (self as any)._restoreScroll);
      },
    });

    blobObserver.disable();

    // ScrollTrigger to pin the section
    const st = ScrollTrigger.create({
      id: 'ABOUT-BLOB-LOCK',
      trigger: section,
      pin: true,
      pinSpacing: false,
      start: 'top top+=100',
      end: '+=100',
      onEnter: () => {
        if (!blobObserver.isEnabled) blobObserver.enable();
      },
      onEnterBack: () => {
        if (!blobObserver.isEnabled) blobObserver.enable();
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
      blobObserver.kill();
    };
  }, [isClient]);

  return (
    <div 
      ref={sectionRef} 
      className="about-blob-scroll relative w-full flex flex-col items-center justify-center py-10 sm:py-14 lg:py-20"
    >
      {/* Blob with text */}
      <div ref={blobContainerRef} className="relative flex w-full justify-center">
        {/* Text blob shape container */}
        <div className="relative flex items-center justify-center">
          {/* Background SVG shape - responsive sizing */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[400px] sm:w-[520px] md:w-[580px] lg:w-[640px] h-auto"
          />
          {/* Text content overlay - absolutely positioned inside the blob */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] text-[#474e3a]">
              {/* All paragraphs stacked, only one visible at a time */}
              {aboutParagraphs.map((text, index) => (
                <div
                  key={index}
                  className="paragraph-item absolute inset-0 flex items-center justify-center"
                >
                  <p
                    className="text-justify text-[14px] sm:text-[15px] lg:text-[16px] leading-[24px]"
                    style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
