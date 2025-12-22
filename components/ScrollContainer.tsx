'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollContainerProps {
  children: React.ReactNode;
  onSplashComplete: boolean;
}

export default function ScrollContainer({ children, onSplashComplete }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (!onSplashComplete) return;

    const handleWheel = (e: WheelEvent) => {
      if (!scrollRef.current) return;
      
      e.preventDefault();
      
      const delta = e.deltaY;
      const currentScroll = scrollRef.current.scrollTop;
      const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      
      let newScroll = currentScroll + delta * 0.5; // Smooth scroll multiplier
      newScroll = Math.max(0, Math.min(maxScroll, newScroll));
      
      scrollRef.current.scrollTop = newScroll;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [onSplashComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      {/* Hidden scrollable container */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx global>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Spacer to create scrollable height */}
        <div style={{ height: '300vh' }} />
      </div>

      {/* Fixed viewport content */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="h-full w-full"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -200]),
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

