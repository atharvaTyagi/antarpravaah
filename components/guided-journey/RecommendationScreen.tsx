'use client';

import { motion } from 'framer-motion';
import Button from '../Button';
import { PathType, pathRecommendations } from '@/data/guidedJourneyContent';

interface RecommendationScreenProps {
  path: PathType;
  onScheduleCall: () => void;
  onClose: () => void;
}

export default function RecommendationScreen({ path, onScheduleCall, onClose }: RecommendationScreenProps) {
  const recommendation = pathRecommendations[path];

  const buttonColors = {
    fg: '#f6edd0',
    fgHover: '#3e3629',
    bgHover: '#f6edd0',
  };

  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      exit={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative w-full p-10 bg-[#3e3629] min-h-[765px]"
    >
      {/* Close Button */}
      <div className="flex items-center justify-end mb-10">
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center text-[#f6edd0] hover:opacity-70 transition-opacity"
          aria-label="Close modal"
        >
          <img
            src="/Icon - Close.svg"
            alt="Close"
            className="h-6 w-6"
            style={{
              filter: 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)',
            }}
          />
        </button>
      </div>

      {/* Logo/Symbol */}
      <div className="flex items-center justify-center mb-10">
        <img 
          src="/logo_small.svg" 
          alt="Antar Pravaah" 
          className="h-[186px] w-auto"
          style={{ filter: 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)' }}
        />
      </div>

      {/* Content */}
      <div className="max-w-[1017px] mx-auto text-center mb-12">
        <h2
          className="text-[48px] leading-[58px] text-[#f6edd0] mb-6"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {recommendation.title}
        </h2>
        <p
          className="text-[16px] leading-[28px] text-[#f6edd0] whitespace-pre-line"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
        >
          {recommendation.message}
        </p>
      </div>

      {/* CTAs */}
      <div className="max-w-[505px] mx-auto flex flex-col items-center gap-4">
        {/* Primary CTA */}
        <Button
          text={recommendation.primaryCta}
          size="large"
          colors={buttonColors}
          onClick={onScheduleCall}
        />

        {/* Secondary CTA */}
        <Button
          text={recommendation.secondaryCta}
          size="small"
          colors={buttonColors}
          onClick={onClose}
        />
      </div>
    </motion.div>
  );
}

