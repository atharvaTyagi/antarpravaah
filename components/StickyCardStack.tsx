'use client';

import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';

export interface StickyStackCard {
  key: string;
  render: React.ReactNode;
}

interface StickyCardStackProps {
  cards: StickyStackCard[];
  /** Sticky top offset in px (to clear fixed headers). */
  stickyTopPx?: number;
  /** Vertical stacking offset between cards (px). */
  stackOffsetPx?: number;
  /** Base offset used in the `top: calc()` positioning for overlap (px). */
  baseOffsetPx?: number;
  /** Card max width (px). */
  cardWidthPx?: number;
  /** Scroll track height per card (vh). Larger = longer “lock” per card. */
  perCardScrollVh?: number;
}

function StickyCard({
  i,
  progress,
  range,
  targetScale,
  stackOffsetPx,
  cardWidthPx,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  stackOffsetPx: number;
  cardWidthPx: number;
  children: React.ReactNode;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const y = useTransform(progress, range, [0, i * stackOffsetPx]);

  return (
    <motion.div
      style={{
        scale,
        y,
        width: 'min(100%, ' + cardWidthPx + 'px)',
        zIndex: i,
      }}
      className="absolute left-1/2 top-0 -translate-x-1/2 origin-top"
    >
      {children}
    </motion.div>
  );
}

export default function StickyCardStack({
  cards,
  stickyTopPx = 340, // main header (188) + subheader (~128) + a little breathing room
  stackOffsetPx = 20,
  baseOffsetPx = 250,
  cardWidthPx = 980,
  perCardScrollVh = 110,
}: StickyCardStackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const computed = useMemo(() => {
    return cards.map((c, i) => {
      // Matches the skiper “stack” feel: later cards end up smaller.
      const targetScale = Math.max(0.5, 1 - (cards.length - i - 1) * 0.1);
      const step = 1 / Math.max(1, cards.length);
      const start = i * step;
      return {
        ...c,
        i,
        range: [start, 1] as [number, number],
        targetScale,
      };
    });
  }, [cards]);

  const trackHeightVh = Math.max(160, cards.length * perCardScrollVh);

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height: `${trackHeightVh}vh` }}
    >
      {/* This sticky viewport is the “lock” area */}
      <div
        className="sticky w-full"
        style={{
          top: stickyTopPx,
          height: `calc(100vh - ${stickyTopPx}px)`,
        }}
      >
        <div className="relative mx-auto h-full w-full" style={{ paddingTop: baseOffsetPx }}>
          {computed.map((c) => (
            <StickyCard
              key={c.key}
              i={c.i}
              progress={scrollYProgress}
              range={c.range}
              targetScale={c.targetScale}
              stackOffsetPx={stackOffsetPx}
              cardWidthPx={cardWidthPx}
            >
              {c.render}
            </StickyCard>
          ))}
        </div>
      </div>
    </div>
  );
}


