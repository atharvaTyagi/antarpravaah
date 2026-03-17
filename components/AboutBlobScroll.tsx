'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

const aboutParagraphs = [
  "I'm Namita, a healer and facilitator with decades of experience guiding people through life's physical, emotional, and energetic challenges. My journey began over twenty years ago in Public Relations, but a quiet inner calling led me to explore paths far beyond the ordinary — editing books, creating events, building ventures, and even running a home bakery. Each experience deepened my understanding of people, life, and the subtle energies that connect us all.",
  
  "The turning point came when I discovered Foot Reflexology. Following my intuition led me into a world of healing I hadn't anticipated, and over time, new modalities found me - each one expanding my understanding of energy, the body, and transformation. Today, I bring experience in Sujok, Acupuncture and Auricular Therapy, Access Bars & Body Processes, Access Energetic Facelift, Systemic Family Constellation Therapy, Shamanism, Transpersonal Regression Therapy, Transcendental Healing, and more.",
  
  "I have had the privilege of guiding hundreds of people across all ages and backgrounds through pain, trauma, grief, relationship struggles, fear, and more. The transformations are countless, yet the heart of the work is always the same: facilitating a remembrance back to themselves.",
  
  "My work transcends any single technique. It is rooted in presence, intuition, and decades of inner practice. When we work together, you are not just learning a modality you are reconnecting with yourself. You'll leave with clarity, presence, and the possibility that comes from remembering the wholeness you've always carried.",
  
  "Healing, to me, is not fixing — it's remembering. Not escaping — it's embracing. Whatever you carry, you are not alone, and I welcome you to this space of transformation."
];

interface AboutBlobScrollProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
  onParagraphChange?: (index: number) => void;
}

export default function AboutBlobScroll({ isActive = false, onEdgeReached, resetToStart, resetToEnd, onParagraphChange }: AboutBlobScrollProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const blobContainerRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const onEdgeReachedRef = useRef(onEdgeReached);
  const onParagraphChangeRef = useRef(onParagraphChange);
  const [isClient, setIsClient] = useState(false);

  // Keep refs in sync with latest props without triggering re-renders
  useEffect(() => { onEdgeReachedRef.current = onEdgeReached; }, [onEdgeReached]);
  useEffect(() => { onParagraphChangeRef.current = onParagraphChange; }, [onParagraphChange]);

  // Cooldown between paragraph changes (prevents residual scroll)
  const scrollCooldown = 400;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reset to start
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    const blobContainer = blobContainerRef.current;
    if (!blobContainer) return;
    
    const paragraphs = Array.from(blobContainer.querySelectorAll<HTMLElement>('.paragraph-item'));
    if (paragraphs.length === 0) return;
    
    // Immediately reset to first paragraph
    gsap.set(paragraphs, { autoAlpha: 0, y: 20 });
    gsap.set(paragraphs[0], { autoAlpha: 1, y: 0 });
    activeIndexRef.current = 0;
    lastScrollTimeRef.current = Date.now();
    onParagraphChange?.(0);
  }, [resetToStart, isClient]);

  // Handle reset to end
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    const blobContainer = blobContainerRef.current;
    if (!blobContainer) return;
    
    const paragraphs = Array.from(blobContainer.querySelectorAll<HTMLElement>('.paragraph-item'));
    if (paragraphs.length === 0) return;
    
    // Immediately reset to last paragraph
    const lastIndex = paragraphs.length - 1;
    gsap.set(paragraphs, { autoAlpha: 0, y: -20 });
    gsap.set(paragraphs[lastIndex], { autoAlpha: 1, y: 0 });
    activeIndexRef.current = lastIndex;
    lastScrollTimeRef.current = Date.now();
    onParagraphChange?.(lastIndex);
  }, [resetToEnd, isClient]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
      // Add delay before enabling to prevent residual scroll from triggering
      const timeout = setTimeout(() => {
        observerRef.current?.enable();
        lastScrollTimeRef.current = Date.now();
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      observerRef.current.disable();
    }
  }, [isActive]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;

    const blobContainer = blobContainerRef.current;
    if (!blobContainer) return;

    const paragraphs = Array.from(blobContainer.querySelectorAll<HTMLElement>('.paragraph-item'));
    if (paragraphs.length === 0) return;

    const time = 0.6;

    // Initialize: show first paragraph, hide others
    gsap.set(paragraphs, { autoAlpha: 0, y: 20 });
    gsap.set(paragraphs[0], { autoAlpha: 1, y: 0 });
    
    // Notify initial paragraph
    onParagraphChangeRef.current?.(0);

    const animateToIndex = (newIndex: number, callback?: () => void) => {
      if (newIndex < 0 || newIndex >= paragraphs.length) return;
      if (animatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      if (newIndex === currentIndex) return;

      animatingRef.current = true;
      const isForward = newIndex > currentIndex;
      const currentPara = paragraphs[currentIndex];
      const nextPara = paragraphs[newIndex];

      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
          activeIndexRef.current = newIndex;
          lastScrollTimeRef.current = Date.now();
          callback?.();
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

      // Notify parent of paragraph change
      tl.call(() => {
        onParagraphChangeRef.current?.(newIndex);
      }, [], '-=0.3'); // Call slightly before paragraph fully fades in
    };

    const handleScroll = (direction: 'up' | 'down') => {
      // Check cooldown to prevent residual scroll
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (animatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      
      if (direction === 'down') {
        if (currentIndex < paragraphs.length - 1) {
          animateToIndex(currentIndex + 1);
        } else {
          // At the end - notify parent to move to next section
          lastScrollTimeRef.current = now;
          onEdgeReachedRef.current?.('end');
        }
      } else {
        if (currentIndex > 0) {
          animateToIndex(currentIndex - 1);
        } else {
          // At the start - notify parent to move to previous section
          lastScrollTimeRef.current = now;
          onEdgeReachedRef.current?.('start');
        }
      }
    };

    // Create Observer for scroll handling - starts disabled
    // Higher tolerance and wheelSpeed adjustment to prevent oversensitivity
    const blobObserver = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50, // Higher tolerance to prevent accidental triggers
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    // Start disabled, will be enabled when isActive becomes true
    blobObserver.disable();
    observerRef.current = blobObserver;

    return () => {
      blobObserver.kill();
      observerRef.current = null;
    };
  }, [isClient]);

  return (
    <div 
      ref={sectionRef} 
      className="about-blob-scroll relative w-full h-full flex items-center justify-center overflow-visible"
    >
      {/* Blob with text */}
      <div ref={blobContainerRef} className="relative flex items-center justify-center">
        {/* Text blob shape container - on mobile, blob extends beyond screen edges */}
        <div className="relative flex items-center justify-center">
          {/* Background SVG shape - mobile: wider than viewport, desktop: contained */}
          <img
            src="/about_text_blob.svg"
            alt=""
            className="w-[640px] sm:w-[400px] md:w-[480px] lg:w-[560px] h-auto max-w-none"
          />
          {/* Text content overlay - absolutely positioned inside the blob */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mobile: "Hi!" title above paragraph */}
            <div className="relative w-full max-w-[320px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-[320px] sm:h-[250px] md:h-[300px] lg:h-[350px] text-[#474e3a] flex flex-col items-center justify-center">
              {/* All paragraphs stacked, only one visible at a time */}
              <div className="relative w-full flex-1 sm:h-full">
                {aboutParagraphs.map((text, index) => (
                  <div
                    key={index}
                    className="paragraph-item absolute inset-0 flex flex-col items-center justify-center"
                  >
                    {/* Hi! title - only visible with first paragraph */}
                    {index === 0 && (
                      <h3
                        className="text-[36px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[1.0] text-center mb-2"
                        style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
                      >
                        Hi !
                      </h3>
                    )}
                    <p
                      className="text-justify text-[16px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-[24px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px]"
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
    </div>
  );
}
