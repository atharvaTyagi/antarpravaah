'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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
}: BookingScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [calendarSelectedDate, setCalendarSelectedDate] = useState<CalendarDate | null>(null);

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

  // Render Calendar View
  if (step === 'calendar') {
    return (
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full p-10 bg-[#2d291f] min-h-[750px]"
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

        {/* Header */}
        <div className="max-w-[1017px] mx-auto text-center mb-12">
          <h2
            className="text-[48px] leading-[58px] text-[#f6edd0] mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Book a session with us
          </h2>
          <p
            className="text-[24px] leading-[100%] text-[#f6edd0]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Pick a date that works best for you
          </p>
        </div>

        {/* Calendar */}
        <div className="max-w-[1017px] mx-auto mb-12">
          <BookingCalendar
            sessionType={sessionType}
            selectedDate={calendarSelectedDate}
            onSelectionChange={setCalendarSelectedDate}
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4">
          <Button
            text="Next"
            size="small"
            colors={buttonColors}
            onClick={() => {
              if (calendarSelectedDate && onDateSelected) {
                // Convert CalendarDate to JavaScript Date
                const date = new Date(
                  calendarSelectedDate.year,
                  calendarSelectedDate.month - 1,
                  calendarSelectedDate.day
                );
                onDateSelected(date);
              }
            }}
            disabled={!calendarSelectedDate}
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

    return (
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        exit={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full p-10 bg-[#2d291f] min-h-[750px]"
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

        {/* Header */}
        <div className="max-w-[1017px] mx-auto text-center mb-12">
          <h2
            className="text-[40px] leading-[52px] text-[#f6edd0] mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Book a session with us
          </h2>
          <p
            className="text-[14px] leading-[24px] text-[#f6edd0] opacity-90"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Leave your name and contact information
          </p>
        </div>

        {/* Selected Date Display */}
        <div className="max-w-[1017px] mx-auto text-center mb-12">
          <p
            className="text-[10px] leading-[14px] text-[#f6edd0] opacity-60 mb-3 uppercase tracking-[1.8px]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            Date Selected
          </p>
          <p
            className="text-[20px] leading-[29px] text-[#f6edd0]"
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
        <div className="max-w-[363px] mx-auto flex flex-col gap-6 mb-12">
          <div className="flex flex-col gap-3 text-center">
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

          <div className="flex flex-col gap-3 text-center">
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
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="flex flex-col gap-3 text-center">
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
        <div className="flex flex-col items-center gap-6">
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
        className="relative w-full p-10 bg-[#2d291f] min-h-[750px]"
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

        {/* Decorative Symbol */}
        <div className="flex items-center justify-center mb-10">
          <img
            src="/page_end_blob.svg"
            alt=""
            className="h-[41px] w-auto"
            style={{
              filter: 'brightness(0) saturate(100%) invert(95%) sepia(8%) saturate(435%) hue-rotate(357deg) brightness(103%) contrast(92%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="max-w-[1017px] mx-auto text-center mb-12">
          <h2
            className="text-[40px] leading-[58px] text-[#f6edd0] mb-4"
            style={{ fontFamily: 'var(--font-saphira), serif' }}
          >
            Thank you, your interest has been recorded
          </h2>
          <p
            className="text-[16px] leading-[29px] text-[#f6edd0]"
            style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
          >
            We will get in touch with you to confirm your session/training.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="max-w-[937px] mx-auto border border-[#6b5d47] rounded-[16px] p-10 mb-12">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <p
                className="text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Date Selected
              </p>
              <p
                className="text-[24px] leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {formattedDate}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Name
              </p>
              <p
                className="text-[24px] leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.name}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Phone
              </p>
              <p
                className="text-[24px] leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.phone}
              </p>
            </div>

            <div className="text-center">
              <p
                className="text-[12px] leading-[14px] text-[#f6edd0] opacity-60 mb-2 uppercase tracking-[1.5px]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                Email
              </p>
              <p
                className="text-[24px] leading-[29px] text-[#f6edd0]"
                style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
              >
                {bookingData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center">
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

