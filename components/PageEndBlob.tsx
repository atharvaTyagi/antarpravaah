'use client';

import pageEndBlob from '@/app/assets/page_end_blob.svg';

type PageEndBlobProps = {
  className?: string;
  alt?: string;
};

export default function PageEndBlob({ className = 'h-10 w-auto', alt = '' }: PageEndBlobProps) {
  const src =
    (pageEndBlob as unknown as { src?: string }).src ?? (pageEndBlob as unknown as string);

  return <img src={src} alt={alt} className={className} />;
}


