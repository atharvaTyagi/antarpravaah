'use client';

import { motion } from 'framer-motion';
import Button from '../Button';

interface WelcomeScreenProps {
  onStartGuided: () => void;
  onSkipToBooking: () => void;
  onClose: () => void;
}

export default function WelcomeScreen({ onStartGuided, onSkipToBooking, onClose }: WelcomeScreenProps) {
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
      className="relative w-full h-full md:h-auto p-6 md:p-10 bg-[#3e3629] md:min-h-[649px] overflow-y-auto"
    >
      {/* Close Button */}
      <div className="flex items-center justify-end mb-6 md:mb-10">
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
      <div className="flex items-center justify-center mb-6 md:mb-10">
        <img 
          src="/logo_small.svg" 
          alt="Antar Pravaah" 
          className="h-[120px] md:h-[186px] w-auto"
          style={{ filter: 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)' }}
        />
      </div>

      {/* Content */}
      <div className="max-w-[1017px] mx-auto text-center mb-8 md:mb-12">
        <h2
          className="text-[32px] md:text-[48px] leading-[1.2] md:leading-[58px] text-[#f6edd0] mb-4 md:mb-6"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          Welcome to your journey
        </h2>
        <p
          className="text-[15px] md:text-[18px] leading-[24px] md:leading-[29px] text-[#f6edd0] px-2"
          style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
        >
          Before we begin, let's take a moment to understand where you are and what you're seeking. There are no wrong
          answers—only honest ones.
        </p>
      </div>

      {/* CTAs */}
      <div className="max-w-[771px] mx-auto flex flex-col items-center gap-4">
        {/* Primary CTAs */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
          <Button
            text="Help me find my path"
            size="large"
            colors={buttonColors}
            onClick={onStartGuided}
          />
          <Button
            text="I know what I need"
            size="large"
            colors={buttonColors}
            onClick={onSkipToBooking}
          />
        </div>

        {/* Secondary CTA */}
        <Button
          text="Let me explore first"
          size="small"
          colors={buttonColors}
          onClick={onClose}
        />
      </div>
    </motion.div>
  );
}

