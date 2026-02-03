'use client';

import { motion } from 'framer-motion';
import Button from '../Button';
import { guidedJourneyQuestions } from '@/data/guidedJourneyContent';

interface QuestionScreenProps {
  questionNumber: number;
  onAnswer: (questionNumber: number, answer: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function QuestionScreen({ questionNumber, onAnswer, onBack, onClose }: QuestionScreenProps) {
  const question = guidedJourneyQuestions.find((q) => q.number === questionNumber);

  if (!question) return null;

  const progressPercentage = ((questionNumber - 1) / 5) * 100;

  const buttonColors = {
    fg: '#3e3629',
    fgHover: '#f6edd0',
    bgHover: '#3e3629',
  };

  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      exit={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative w-full p-10 bg-[#f6edd0] min-h-[650px]"
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-10">
        {/* Progress Bar */}
        <div className="flex-1 max-w-[913px] h-2 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#3e3629] rounded-full"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="ml-8 flex h-6 w-6 items-center justify-center text-[#3e3629] hover:opacity-70 transition-opacity"
          aria-label="Close modal"
        >
          <img
            src="/Icon - Close.svg"
            alt="Close"
            className="h-6 w-6"
            style={{
              filter: 'brightness(0) saturate(100%) invert(19%) sepia(11%) saturate(1214%) hue-rotate(359deg) brightness(96%) contrast(91%)',
            }}
          />
        </button>
      </div>

      {/* Question */}
      <div className="max-w-[1017px] mx-auto text-center mb-12">
        <h2
          className="text-[48px] leading-[58px] text-[#3e3629] mb-4"
          style={{ fontFamily: 'var(--font-saphira), serif' }}
        >
          {question.title}
        </h2>
        {question.subtitle && (
          <p
            className="text-[16px] leading-[29px] text-[#3e3629]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="max-w-[1017px] mx-auto flex flex-col items-center gap-3 mb-12">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onAnswer(questionNumber, option.text)}
            className="px-6 py-2 text-[12px] leading-[20px] text-[#3e3629] cursor-pointer uppercase tracking-[1.5px] rounded-full transition-all duration-300 hover:bg-[#3e3629]/10"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {option.text}
          </motion.button>
        ))}
      </div>

      {/* Decorative Symbol */}
      <div className="flex items-center justify-center mb-6">
        <img
          src="/page_end_blob.svg"
          alt=""
          className="h-[41px] w-auto"
          style={{
            filter: 'brightness(0) saturate(100%) invert(19%) sepia(11%) saturate(1214%) hue-rotate(359deg) brightness(96%) contrast(91%)',
          }}
        />
      </div>

      {/* Skip to Booking */}
      <div className="flex items-center justify-center">
        <Button
          text="I know what I need"
          size="small"
          colors={buttonColors}
          onClick={onClose}
        />
      </div>
    </motion.div>
  );
}

