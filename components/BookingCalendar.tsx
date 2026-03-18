'use client';

import { useRef } from 'react';
import { useCalendarState } from 'react-stately';
import { useCalendar, useCalendarGrid, useCalendarCell } from 'react-aria';
import { createCalendar, getWeeksInMonth, today, getLocalTimeZone } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';
import type { CalendarState, RangeCalendarState } from 'react-stately';
import type { AriaCalendarGridProps } from 'react-aria';

export type SessionType = 'workshop' | 'training';

interface BookingCalendarProps {
  sessionType: SessionType;
  selectedDate?: CalendarDate | null;
  onSelectionChange?: (date: CalendarDate | null) => void;
}

export default function BookingCalendar({ sessionType: _sessionType, selectedDate, onSelectionChange }: BookingCalendarProps) {
  // Get today's date to disable past dates
  const todayDate = today(getLocalTimeZone());

  const state = useCalendarState({
    locale: 'en-US',
    createCalendar,
    value: selectedDate || undefined,
    onChange: onSelectionChange,
    minValue: todayDate, // Disable all dates before today
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    { 'aria-label': 'Book a session', minValue: todayDate },
    state
  );

  // Extract only valid DOM props from calendarProps
  const { role, 'aria-label': ariaLabel } = calendarProps;

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      ref={ref}
      className="w-full border border-[#f6edd0] rounded-[24px] p-[40px] flex flex-col gap-[16px]"
    >
      {/* Month Navigation */}
      <CalendarHeader
        title={title}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />

      {/* Calendar Grid */}
      <CalendarGrid state={state} />
    </div>
  );
}

interface CalendarHeaderProps {
  title: string;
  prevButtonProps: React.HTMLAttributes<HTMLButtonElement>;
  nextButtonProps: React.HTMLAttributes<HTMLButtonElement>;
}

// Helper to extract valid DOM props from react-aria button props
function extractDOMButtonProps(props: any) {
  const {
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    onFocusChange,
    isDisabled,
    ...domProps
  } = props;
  return { onPress, isDisabled, domProps };
}

function CalendarHeader({ title, prevButtonProps, nextButtonProps }: CalendarHeaderProps) {
  const { onPress: onPrevPress, isDisabled: isPrevDisabled, domProps: prevDomProps } = extractDOMButtonProps(prevButtonProps);
  const { onPress: onNextPress, isDisabled: isNextDisabled, domProps: nextDomProps } = extractDOMButtonProps(nextButtonProps);

  return (
    <div className="flex items-center gap-[16px] w-full">
      {/* Previous Month Button */}
      <button
        {...prevDomProps}
        onClick={onPrevPress}
        disabled={isPrevDisabled}
        className="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous month"
      >
        <svg
          width="15"
          height="20"
          viewBox="0 0 15 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-180 scale-y-[-1]"
        >
          <path
            d="M1.5 1.5L13.5 10L1.5 18.5"
            stroke="#F6EDD0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Month & Year */}
      <p
        className="flex-1 text-center text-[24px] leading-[100%] tracking-[3.84px] uppercase text-[#f6edd0]"
        style={{ fontFamily: 'var(--font-graphik), sans-serif', fontWeight: 300 }}
      >
        {title}
      </p>

      {/* Next Month Button */}
      <button
        {...nextDomProps}
        onClick={onNextPress}
        disabled={isNextDisabled}
        className="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next month"
      >
        <svg
          width="15"
          height="20"
          viewBox="0 0 15 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.5 1.5L13.5 10L1.5 18.5"
            stroke="#F6EDD0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

interface CalendarGridProps {
  state: CalendarState | RangeCalendarState;
}

function CalendarGrid({ state }: CalendarGridProps) {
  const { gridProps } = useCalendarGrid({} as AriaCalendarGridProps, state);

  const startDate = state.visibleRange.start;
  const weeksInMonth = getWeeksInMonth(startDate, 'en-US');

  // Get the first day of the month and find the start of the week containing it
  const firstDayOfMonth = startDate.set({ day: 1 });
  const dayOfWeek = firstDayOfMonth.day; // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the start date (beginning of the first week shown)
  let currentDate = firstDayOfMonth.subtract({ days: dayOfWeek });

  // Build array of all dates to display
  const allDates: CalendarDate[] = [];
  const totalCells = weeksInMonth * 7;
  
  for (let i = 0; i < totalCells; i++) {
    allDates.push(currentDate);
    currentDate = currentDate.add({ days: 1 });
  }

  // Extract only valid DOM props from gridProps
  const { role, 'aria-label': ariaLabel } = gridProps;

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className="grid grid-cols-7 gap-[10px] p-[10px] w-full"
    >
      {allDates.map((date, index) => (
        <CalendarCell
          key={index}
          state={state}
          date={date}
          currentMonth={startDate.month}
        />
      ))}
    </div>
  );
}

interface CalendarCellProps {
  state: CalendarState | RangeCalendarState;
  date: CalendarDate;
  currentMonth: number;
}

function CalendarCell({ state, date, currentMonth }: CalendarCellProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isOutsideMonth = date.month !== currentMonth;

  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } = useCalendarCell(
    { date },
    state,
    ref
  );

  // Extract valid DOM props from react-aria button props (excluding event handlers)
  const { domProps } = extractDOMButtonProps(buttonProps);

  // Extract only valid DOM props from cellProps
  const { role: cellRole } = cellProps;

  const handleClick = () => {
    // Directly call state.selectDate to update the selection
    // This bypasses the onPress mechanism which requires PressEvent
    if (!isDisabled && !isOutsideMonth) {
      (state as CalendarState).selectDate(date);
    }
  };

  // Empty cell for dates outside the current month
  if (isOutsideMonth) {
    return <div role={cellRole} aria-hidden className="pointer-events-none" />;
  }

  // Selected state (date only, no labels)
  if (isSelected) {
    return (
      <div role={cellRole}>
        <button
          {...domProps}
          onClick={handleClick}
          ref={ref}
          className="w-full flex flex-col gap-[10px] items-center justify-center p-[20px] rounded-[24px] bg-[#f4edd3] cursor-pointer"
        >
          <p
            className="text-[24px] leading-[100%] text-[#2d291f] text-center"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            {formattedDate}
          </p>
        </button>
      </div>
    );
  }

  // Disabled state
  if (isDisabled) {
    return (
      <div role={cellRole}>
        <button
          {...domProps}
          onClick={handleClick}
          ref={ref}
          disabled
          className="w-full flex flex-col gap-[10px] items-center justify-center p-[20px] rounded-[24px] bg-[#f6edd0] opacity-40 cursor-not-allowed"
        >
          <p
            className="text-[24px] leading-[100%] text-[#2d291f] text-center"
            style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
          >
            {formattedDate}
          </p>
        </button>
      </div>
    );
  }

  // Default available state
  return (
    <div role={cellRole}>
      <button
        {...domProps}
        onClick={handleClick}
        ref={ref}
        className="w-full flex flex-col gap-[10px] items-center justify-center p-[20px] rounded-[24px] bg-[#f6edd0] opacity-40 hover:opacity-60 cursor-pointer transition-opacity"
      >
        <p
          className="text-[24px] leading-[100%] text-[#2d291f] text-center"
          style={{ fontFamily: 'var(--font-saphira), serif', fontWeight: 400 }}
        >
          {formattedDate}
        </p>
      </button>
    </div>
  );
}
