'use client';

import { useState } from 'react';
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
  quality = 85,
}: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false);

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
        opacity: loaded ? 1 : 0,
        transitionDuration: `${durationMs}ms`,
      }}
      loading="lazy"
    />
  );
}


