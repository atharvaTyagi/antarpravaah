'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/dist/Observer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer);
}

const inspirationParagraphs = [
  {
    text: "This work is not mine alone. I would not be here were it not for the Grace, guidance and support of my Guru and the lineage of the tradition of which I am a part.",
    links: [
      { url: "http://www.rikhiapeeth.in", text: "http://www.rikhiapeeth.in" },
      { url: "https://www.biharyoga.net/index.php", text: "https://www.biharyoga.net/index.php" },
    ],
  },
  {
    text: "With stalwarts like Swami Sivananda Saraswati, Swami Satyananda Saraswati, Swami Niranjananda Saraswati and Swami Satyasangananda Saraswati lighting the path, I am left only to walk in their footsteps. It changed my life. The work is theirs, I am merely the face of it.",
    links: [],
  },
  {
    text: "My teachers whose enlightened minds, passion, zeal and spirit of seva drive me every single day to show up. Namita Unnikrishnan, Dr. BN Jha, Dr. H Bhojraj, Urmimala Deb, Ritu Kabra, Marina Toledo, Dain Heer, Gary Douglas and the countless people who walked through my door trusting me with their body, mind and soul. I am grateful. So grateful.",
    links: [],
  },
];

interface InspirationScrollProps {
  isActive?: boolean;
  onEdgeReached?: (edge: 'start' | 'end') => void;
  resetToStart?: boolean;
  resetToEnd?: boolean;
}

export default function InspirationScroll({ isActive = false, onEdgeReached, resetToStart, resetToEnd }: InspirationScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paragraphsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const observerRef = useRef<Observer | null>(null);
  const lastScrollTimeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  const scrollCooldown = 400;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reset to start
  useEffect(() => {
    if (!resetToStart || !isClient) return;
    
    const paragraphsContainer = paragraphsContainerRef.current;
    if (!paragraphsContainer) return;
    
    const paragraphs = Array.from(paragraphsContainer.querySelectorAll<HTMLElement>('.inspiration-para'));
    if (paragraphs.length === 0) return;
    
    gsap.set(paragraphs, { autoAlpha: 0, y: 20 });
    gsap.set(paragraphs[0], { autoAlpha: 1, y: 0 });
    activeIndexRef.current = 0;
    lastScrollTimeRef.current = Date.now();
  }, [resetToStart, isClient]);

  // Handle reset to end
  useEffect(() => {
    if (!resetToEnd || !isClient) return;
    
    const paragraphsContainer = paragraphsContainerRef.current;
    if (!paragraphsContainer) return;
    
    const paragraphs = Array.from(paragraphsContainer.querySelectorAll<HTMLElement>('.inspiration-para'));
    if (paragraphs.length === 0) return;
    
    const lastIndex = paragraphs.length - 1;
    gsap.set(paragraphs, { autoAlpha: 0, y: -20 });
    gsap.set(paragraphs[lastIndex], { autoAlpha: 1, y: 0 });
    activeIndexRef.current = lastIndex;
    lastScrollTimeRef.current = Date.now();
  }, [resetToEnd, isClient]);

  // Enable/disable observer based on isActive prop
  useEffect(() => {
    if (!observerRef.current) return;
    
    if (isActive) {
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

    const paragraphsContainer = paragraphsContainerRef.current;
    if (!paragraphsContainer) return;

    const paragraphs = Array.from(paragraphsContainer.querySelectorAll<HTMLElement>('.inspiration-para'));
    if (paragraphs.length === 0) return;

    const time = 0.6;

    // Initialize: show first paragraph, hide others
    gsap.set(paragraphs, { autoAlpha: 0, y: 20 });
    gsap.set(paragraphs[0], { autoAlpha: 1, y: 0 });

    const animateToIndex = (newIndex: number) => {
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
        }
      });

      tl.to(currentPara, {
        autoAlpha: 0,
        y: isForward ? -20 : 20,
        duration: time * 0.5,
        ease: 'power2.inOut',
      });

      tl.fromTo(
        nextPara,
        { autoAlpha: 0, y: isForward ? 20 : -20 },
        { autoAlpha: 1, y: 0, duration: time * 0.5, ease: 'power2.out' },
        '-=0.1'
      );
    };

    const handleScroll = (direction: 'up' | 'down') => {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollCooldown) return;
      if (animatingRef.current) return;
      
      const currentIndex = activeIndexRef.current;
      
      if (direction === 'down') {
        if (currentIndex < paragraphs.length - 1) {
          animateToIndex(currentIndex + 1);
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('end');
        }
      } else {
        if (currentIndex > 0) {
          animateToIndex(currentIndex - 1);
        } else {
          lastScrollTimeRef.current = now;
          onEdgeReached?.('start');
        }
      }
    };

    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 50,
      preventDefault: true,
      onDown: () => handleScroll('up'),
      onUp: () => handleScroll('down'),
    });

    observer.disable();
    observerRef.current = observer;

    return () => {
      observer.kill();
      observerRef.current = null;
    };
  }, [isClient, onEdgeReached]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-[#93a378] rounded-[24px] px-4 py-10 flex flex-col items-center justify-center"
    >
      {/* Static title */}
      <h2
        className="text-[36px] leading-[1.0] text-[#474e3a] text-center mb-10"
        style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
      >
        My inspiration
      </h2>
      
      {/* Scrolling paragraphs container */}
      <div ref={paragraphsContainerRef} className="relative w-full flex-1 flex items-center justify-center">
        <div className="relative w-full h-[200px]">
          {inspirationParagraphs.map((para, index) => (
            <div
              key={index}
              className="inspiration-para absolute inset-0 flex flex-col items-center justify-center text-[#474e3a] text-center px-2"
            >
              <p
                className="text-[16px] leading-[24px] mb-4"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
              >
                {para.text}
              </p>
              {para.links.length > 0 && (
                <div className="flex flex-col gap-1">
                  {para.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:opacity-80 transition-opacity text-[16px]"
                      style={{ fontFamily: 'var(--font-graphik), sans-serif' }}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
