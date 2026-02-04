'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './guided-journey/WelcomeScreen';
import QuestionScreen from './guided-journey/QuestionScreen';
import RecommendationScreen from './guided-journey/RecommendationScreen';
import BookingScreen from './guided-journey/BookingScreen';
import { guidedJourneyQuestions, PathType, calculatePath } from '@/data/guidedJourneyContent';
import { submitBooking, formatDateForBooking, type SessionType } from '@/lib/api/booking';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('welcome');
      setAnswers({});
      setRecommendedPath(null);
      setBookingData({});
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open, always restore on close/unmount
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverflow = html.style.overflow;

    if (isOpen) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
    }

      return () => {
      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
      };
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

  const handleBookingFormSubmit = async (name: string, phone: string, email: string) => {
    if (!bookingData.date) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Determine session type based on recommended path or default to 'Workshop'
    // PathType 'trainings' maps to SessionType 'Training', all others are 'Workshop'
    const sessionType: SessionType = recommendedPath === 'trainings' ? 'Training' : 'Workshop';

    const result = await submitBooking({
      name,
      email,
      phone,
      selectedDate: formatDateForBooking(bookingData.date),
      sessionType,
    });

    setIsSubmitting(false);

    if (result.success) {
      setBookingData({ ...bookingData, name, phone, email });
      setCurrentStep('booking-confirmation');
    } else {
      setSubmitError(result.error || 'Failed to submit booking. Please try again.');
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-[1097px] max-h-[90vh] min-h-[650px] overflow-hidden rounded-[24px] shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
          <div className="h-full overflow-y-auto no-scrollbar">
            {/* Render current step - Smooth content transitions only */}
            <AnimatePresence mode="sync" initial={false}>
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
                sessionType="workshop"
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
                isSubmitting={isSubmitting}
                submitError={submitError}
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

