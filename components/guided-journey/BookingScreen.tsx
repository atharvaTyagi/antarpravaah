'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Button from '../Button';
import BookingCalendar, { SessionType } from '../BookingCalendar';
import type { CalendarDate } from '@internationalized/date';

type BookingStep = 'calendar' | 'form' | 'confirmation';

interface BookingScreenProps {
  step: BookingStep;
  selectedDate?: Date;
  bookingData?: {
    date?: Date;
    name?: string;
    phone?: string;
    email?: string;
  };
  sessionType?: SessionType;
  onDateSelected?: (date: Date) => void;
  onFormSubmit?: (name: string, phone: string, email: string) => void;
  onBack?: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  showProgress?: boolean; // Show progress bar (for when accessed directly, not from questions flow)
}

export default function BookingScreen({
  step,
  selectedDate,
  bookingData,
  sessionType = 'workshop',
  onDateSelected,
  onFormSubmit,
  onBack,
  onClose,
  isSubmitting = false,
  submitError = null,
  showProgress = false,
}: BookingScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [calendarSelectedDate, setCalendarSelectedDate] = useState<CalendarDate | null>(null);
  const [nativeDate, setNativeDate] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const buttonColors = {
    fg: '#f6edd0',
    fgHover: '#2d291f',
    bgHover: '#f6edd0',
  };

  const handleFormSubmit = () => {
    if (onFormSubmit && formData.name && formData.phone && formData.email) {
      onFormSubmit(formData.name, formData.phone, formData.email);
    }
  };

  // Get today's date as YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  // Format the native date for display
  const formattedNativeDate = nativeDate
    ? new Date(nativeDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  // Render Calendar View
  if (step === 'calendar') {
    // Progress percentage: Assuming user went through all 6 questions + recommendation = 7 steps
    // Total flow is: welcome (0%) → 6 questions (0-100%) → recommendation (100%) → booking (100%)
    const progressPercentage = showProgress ? 100 : 0;

    return (
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full h-full md:h-auto p-6 md:p-10 bg-[#2d291f] md:min-h-[750px] overflow-y-auto"
      >
        {/* Navigation with Progress Bar and Close Button */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          {showProgress ? (
            <>
              {/* Progress Bar */}
              <div className="flex-1 max-w-[913px] h-2 rounded-full overflow-hidden relative bg-[#6b5d47]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-[#f6edd0] rounded-full"
                />
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="ml-4 md:ml-8 flex h-6 w-6 items-center justify-center text-[#f6edd0] hover:opacity-70 transition-opacity"
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
            </>
          ) : (
            <div className="w-full flex justify-end">
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
          )}
        </div>

        {/* Header */}
        <div className="max-w-[1017px] mx-auto text-center mb-8 md:mb-12">
          <h2
            className="text-[32px] md:text-[48px] leading-[1.2] md:leading-[58px] text-[#f6edd0] mb-3 md:mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Book a session with us
          </h2>
          <p
            className="text-[16px] md:text-[24px] leading-[1.4] md:leading-[100%] text-[#f6edd0]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Pick a date that works best for you
          </p>
        </div>

        {/* Calendar - Desktop: full calendar, Mobile: native date picker */}
        {isMobile ? (
          <div className="flex flex-col items-center gap-6 mb-10">
            {/* 
              Native date input styled as a button. 
              On iOS, tapping the input opens the native date wheel picker.
              On Android, it opens the system date picker dialog.
              We use opacity-0 on the input overlaid on a styled label so it works
              across all mobile browsers without showPicker().
            */}
            <label className="relative inline-flex cursor-pointer">
              <input
                ref={nativeDateInputRef}
                type="date"
                value={nativeDate}
                min={todayStr}
                onChange={(e) => setNativeDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Choose a date"
              />
              <span
                className="px-8 py-4 border border-[#6b5d47] rounded-full text-[#f6edd0] text-[16px] tracking-[1.5px] uppercase transition-colors active:bg-[#f6edd0]/10 pointer-events-none"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {nativeDate ? 'Change Date' : 'Choose Date'}
              </span>
            </label>

            {/* Show selected date */}
            {nativeDate && (
              <div className="text-center">
                <p
                  className="text-[12px] text-[#f6edd0] opacity-60 uppercase tracking-[1.8px] mb-2"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  Date Selected
                </p>
                <p
                  className="text-[20px] text-[#f6edd0]"
                  style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
                >
                  {formattedNativeDate}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-[1017px] mx-auto mb-12">
            <BookingCalendar
              sessionType={sessionType}
              selectedDate={calendarSelectedDate}
              onSelectionChange={setCalendarSelectedDate}
            />
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 pb-4 md:pb-0">
          <Button
            text="Next"
            size="small"
            colors={buttonColors}
            onClick={() => {
              if (isMobile && nativeDate && onDateSelected) {
                const date = new Date(nativeDate + 'T00:00:00');
                onDateSelected(date);
              } else if (calendarSelectedDate && onDateSelected) {
                // Convert CalendarDate to JavaScript Date
                const date = new Date(
                  calendarSelectedDate.year,
                  calendarSelectedDate.month - 1,
                  calendarSelectedDate.day
                );
                onDateSelected(date);
              }
            }}
            disabled={isMobile ? !nativeDate : !calendarSelectedDate}
          />
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

  // Render Form View
  if (step === 'form') {
    const formattedDate = selectedDate
      ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    const progressPercentage = showProgress ? 100 : 0;

    return (
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full h-full md:h-auto p-6 md:p-10 bg-[#2d291f] md:min-h-[750px] overflow-y-auto"
      >
        {/* Navigation with Progress Bar and Close Button */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          {showProgress ? (
            <>
              {/* Progress Bar */}
              <div className="flex-1 max-w-[913px] h-2 rounded-full overflow-hidden relative bg-[#6b5d47]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-[#f6edd0] rounded-full"
                />
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="ml-4 md:ml-8 flex h-6 w-6 items-center justify-center text-[#f6edd0] hover:opacity-70 transition-opacity"
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
            </>
          ) : (
            <div className="w-full flex justify-end">
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
          )}
        </div>

        {/* Header */}
        <div className="max-w-[1017px] mx-auto text-center mb-8 md:mb-12">
          <h2
            className="text-[28px] md:text-[40px] leading-[1.2] md:leading-[52px] text-[#f6edd0] mb-3 md:mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Book a session with us
          </h2>
          <p
            className="text-[13px] md:text-[14px] leading-[20px] md:leading-[24px] text-[#f6edd0] opacity-90"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Leave your name and contact information
          </p>
        </div>

        {/* Selected Date Display */}
        <div className="max-w-[1017px] mx-auto text-center mb-8 md:mb-12">
          <p
            className="text-[10px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 md:mb-3 uppercase tracking-[1.8px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Date Selected
          </p>
          <p
            className="text-[18px] md:text-[20px] leading-[29px] text-[#f6edd0]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            {formattedDate}
          </p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="max-w-[363px] mx-auto mb-6">
            <p
              className="text-[14px] leading-[20px] text-red-400 text-center"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 400 }}
            >
              {submitError}
            </p>
          </div>
        )}

        {/* Form Fields */}
        <div className="max-w-[363px] mx-auto flex flex-col gap-5 md:gap-6 mb-8 md:mb-12 px-2 md:px-0">
          <div className="flex flex-col gap-2 md:gap-3 text-center">
            <label
              className="text-[10px] leading-[14px] text-[#f6edd0] opacity-60 uppercase tracking-[1.8px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-transparent border border-[#6b5d47] rounded-full px-6 py-3 text-[16px] text-[#f6edd0] text-center focus:outline-none focus:border-[#f6edd0] placeholder-[#6b5d47] transition-colors"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              placeholder="Name Surname"
            />
          </div>

          <div className="flex flex-col gap-2 md:gap-3 text-center">
            <label
              className="text-[10px] leading-[14px] text-[#f6edd0] opacity-60 uppercase tracking-[1.8px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-transparent border border-[#6b5d47] rounded-full px-6 py-3 text-[16px] text-[#f6edd0] text-center focus:outline-none focus:border-[#f6edd0] placeholder-[#6b5d47] transition-colors"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              placeholder="+91 98107 10036"
            />
          </div>

          <div className="flex flex-col gap-2 md:gap-3 text-center">
            <label
              className="text-[10px] leading-[14px] text-[#f6edd0] opacity-60 uppercase tracking-[1.8px]"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-transparent border border-[#6b5d47] rounded-full px-6 py-3 text-[16px] text-[#f6edd0] text-center focus:outline-none focus:border-[#f6edd0] placeholder-[#6b5d47] transition-colors"
              style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              placeholder="hello@antarpravaah.com"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 md:gap-6 pb-4 md:pb-0">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                text="Back"
                size="small"
                colors={buttonColors}
                onClick={onBack}
                disabled={isSubmitting}
              />
            )}
            <Button
              text={isSubmitting ? 'Submitting...' : 'Next'}
              size="small"
              colors={buttonColors}
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            />
          </div>
          <Button
            text="Let me explore first"
            size="small"
            colors={buttonColors}
            onClick={onClose}
            disabled={isSubmitting}
          />
        </div>
      </motion.div>
    );
  }

  // Render Confirmation View
  if (step === 'confirmation') {
    const formattedDate = bookingData?.date
      ? bookingData.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    return (
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full h-full md:h-auto p-6 md:p-10 bg-[#2d291f] md:min-h-[750px] overflow-y-auto"
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

        {/* Decorative Symbol */}
        <div className="flex items-center justify-center mb-6 md:mb-10">
          <img
            src="/page_end_blob.svg"
            alt=""
            className="h-[30px] md:h-[41px] w-auto"
            style={{
              filter: 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="max-w-[1017px] mx-auto text-center mb-8 md:mb-12">
          <h2
            className="text-[28px] md:text-[40px] leading-[1.2] md:leading-[58px] text-[#f6edd0] mb-3 md:mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Thank you, your interest has been recorded
          </h2>
          <p
            className="text-[14px] md:text-[16px] leading-[22px] md:leading-[29px] text-[#f6edd0]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            We will get in touch with you to confirm your session/training.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="max-w-[937px] mx-auto border border-[#6b5d47] rounded-[16px] p-6 md:p-10 mb-8 md:mb-12">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="text-center">
              <p
                className="text-[11px] md:text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Date Selected
              </p>
              <p
                className="text-[18px] md:text-[24px] leading-[26px] md:leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {formattedDate}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[11px] md:text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Name
              </p>
              <p
                className="text-[18px] md:text-[24px] leading-[26px] md:leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.name}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[11px] md:text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Phone
              </p>
              <p
                className="text-[18px] md:text-[24px] leading-[26px] md:leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.phone}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[11px] md:text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Email
              </p>
              <p
                className="text-[18px] md:text-[24px] leading-[26px] md:leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center pb-4 md:pb-0">
          <Button
            text="Close"
            size="small"
            colors={buttonColors}
            onClick={onClose}
          />
        </div>
      </motion.div>
    );
  }

  return null;
}

