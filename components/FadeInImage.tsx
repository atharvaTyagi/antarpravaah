'use client';

import { useCallback, useRef, useState } from 'react';

type FadeInImageProps = {
  src: string;
  alt: string;
  className?: string;
  /**
   * Duration in ms for the opacity transition.
   */
  durationMs?: number;
};

export default function FadeInImage({
  src,
  alt,
  className = '',
  durationMs = 350,
}: FadeInImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      // Handle cached images where onLoad may not fire.
      if (node?.complete) setLoadedSrc(src);
    },
    [src]
  );

  return (
    <img
      ref={handleRef}
      src={src}
      alt={alt}
      onLoad={() => setLoadedSrc(src)}
      className={`${className} transition-opacity`}
      style={{
        opacity: loaded ? 1 : 0,
        transitionDuration: `${durationMs}ms`,
      }}
    />
  );
}


