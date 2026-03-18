'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type FadeInImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /**
   * Duration in ms for the opacity transition.
   */
  durationMs?: number;
  /**
   * Delay in ms before starting the fade-in animation.
   */
  delayMs?: number;
  /**
   * Image quality (1-100)
   */
  quality?: number;
};

export default function FadeInImage({
  src,
  alt,
  width,
  height,
  className = '',
  durationMs = 350,
  delayMs = 0,
  quality = 85,
}: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (loaded && delayMs > 0) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delayMs);
      return () => clearTimeout(timer);
    } else if (loaded) {
      setShouldShow(true);
    }
  }, [loaded, delayMs]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity`}
      style={{
        opacity: shouldShow ? 1 : 0,
        transitionDuration: `${durationMs}ms`,
      }}
      loading="eager"
    />
  );
}


