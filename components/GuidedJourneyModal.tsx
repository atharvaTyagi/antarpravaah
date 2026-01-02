'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './guided-journey/WelcomeScreen';
import QuestionScreen from './guided-journey/QuestionScreen';
import RecommendationScreen from './guided-journey/RecommendationScreen';
import BookingScreen from './guided-journey/BookingScreen';
import { guidedJourneyQuestions, PathType, calculatePath } from '@/data/guidedJourneyContent';

interface GuidedJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ModalStep = 
  | 'welcome'
  | 'question-1'
  | 'question-2'
  | 'question-3'
  | 'question-4'
  | 'question-5'
  | 'question-6'
  | 'recommendation'
  | 'booking-calendar'
  | 'booking-form'
  | 'booking-confirmation';

export default function GuidedJourneyModal({ isOpen, onClose }: GuidedJourneyModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendedPath, setRecommendedPath] = useState<PathType | null>(null);
  const [bookingData, setBookingData] = useState<{
    date?: Date;
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('welcome');
      setAnswers({});
      setRecommendedPath(null);
      setBookingData({});
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store original values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      // Disable scrolling on both body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Pause Lenis if available
      (window as unknown as { __lenis?: { stop?: () => void } }).__lenis?.stop?.();

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        // Resume Lenis
        (window as unknown as { __lenis?: { start?: () => void } }).__lenis?.start?.();
      };
    }
  }, [isOpen]);

  const handleStartGuidedFlow = () => {
    setCurrentStep('question-1');
  };

  const handleSkipToBooking = () => {
    setCurrentStep('booking-calendar');
  };

  const handleAnswer = (questionNumber: number, answer: string) => {
    const newAnswers = { ...answers, [questionNumber]: answer };
    setAnswers(newAnswers);

    // Move to next question or recommendation
    if (questionNumber < 6) {
      setCurrentStep(`question-${questionNumber + 1}` as ModalStep);
    } else {
      // Calculate recommended path based on all answers
      const path = calculatePath(newAnswers);
      setRecommendedPath(path);
      setCurrentStep('recommendation');
    }
  };

  const handleScheduleCall = () => {
    setCurrentStep('booking-calendar');
  };

  const handleDateSelected = (date: Date) => {
    setBookingData({ ...bookingData, date });
    setCurrentStep('booking-form');
  };

  const handleBookingFormSubmit = (name: string, phone: string, email: string) => {
    setBookingData({ ...bookingData, name, phone, email });
    setCurrentStep('booking-confirmation');
  };

  const handleBack = () => {
    const stepOrder: ModalStep[] = [
      'welcome',
      'question-1',
      'question-2',
      'question-3',
      'question-4',
      'question-5',
      'question-6',
      'recommendation',
      'booking-calendar',
      'booking-form',
      'booking-confirmation',
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const getCurrentQuestionNumber = (): number => {
    const match = currentStep.match(/question-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const currentQuestionNumber = getCurrentQuestionNumber();

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/60"
        onClick={onClose}
      />

      {/* Modal Container - No animation on container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-none">
        <div
          className="relative w-full max-w-[1097px] max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Render current step - Smooth content transitions only */}
          <AnimatePresence mode="wait">
            {currentStep === 'welcome' && (
              <WelcomeScreen
                key="welcome"
                onStartGuided={handleStartGuidedFlow}
                onSkipToBooking={handleSkipToBooking}
                onClose={onClose}
              />
            )}

            {currentStep.startsWith('question-') && currentQuestionNumber > 0 && (
              <QuestionScreen
                key={currentStep}
                questionNumber={currentQuestionNumber}
                onAnswer={handleAnswer}
                onBack={handleBack}
                onClose={onClose}
              />
            )}

            {currentStep === 'recommendation' && recommendedPath && (
              <RecommendationScreen
                key="recommendation"
                path={recommendedPath}
                onScheduleCall={handleScheduleCall}
                onClose={onClose}
              />
            )}

            {currentStep === 'booking-calendar' && (
              <BookingScreen
                key="booking"
                step="calendar"
                onDateSelected={handleDateSelected}
                onBack={handleBack}
                onClose={onClose}
              />
            )}

            {currentStep === 'booking-form' && bookingData.date && (
              <BookingScreen
                key="booking-form"
                step="form"
                selectedDate={bookingData.date}
                onFormSubmit={handleBookingFormSubmit}
                onBack={handleBack}
                onClose={onClose}
              />
            )}

            {currentStep === 'booking-confirmation' && (
              <BookingScreen
                key="booking-confirmation"
                step="confirmation"
                bookingData={bookingData}
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

