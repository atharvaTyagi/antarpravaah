// ============================================================================
// Client-Side Booking Submission - Google Apps Script Integration
// ============================================================================
// This module submits booking data to a Google Apps Script Web App
// which appends the data to a Google Sheet.
//
// Required environment variables:
// - NEXT_PUBLIC_GOOGLE_SCRIPT_URL: The deployed Apps Script Web App URL
// - NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN: Shared secret token for authentication
// ============================================================================

export type SessionType = 'Workshop' | 'Training';

export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  selectedDate: string; // YYYY-MM-DD format
  sessionType: SessionType;
}

export interface SubmitBookingResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Formats a JavaScript Date to YYYY-MM-DD string
 */
export function formatDateForBooking(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates date format (YYYY-MM-DD)
 */
function isValidDateFormat(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates phone format (basic validation - allows various formats)
 */
function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parentheses, and + prefix
  const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validates booking payload and returns field errors if any
 */
function validatePayload(payload: BookingPayload): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!payload.name || payload.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!payload.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Invalid email format';
  }

  if (!payload.phone) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(payload.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!payload.selectedDate) {
    errors.selectedDate = 'Selected date is required';
  } else if (!isValidDateFormat(payload.selectedDate)) {
    errors.selectedDate = 'Date must be in YYYY-MM-DD format';
  }

  if (!payload.sessionType || (payload.sessionType !== 'Workshop' && payload.sessionType !== 'Training')) {
    errors.sessionType = 'Session type must be "Workshop" or "Training"';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// Google Apps Script Submission
// ============================================================================

/**
 * Submits booking data to Google Apps Script Web App.
 *
 * @param payload - The booking data to submit
 * @returns Promise resolving to the submission result
 *
 * @example
 * ```typescript
 * const result = await submitBooking({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+91 98765 43210',
 *   selectedDate: '2025-12-26',
 *   sessionType: 'Workshop'
 * });
 *
 * if (result.success) {
 *   // Show success message
 * } else {
 *   // Handle error
 *   console.error(result.error);
 * }
 * ```
 */
export async function submitBooking(payload: BookingPayload): Promise<SubmitBookingResult> {
  // Validate payload
  const validation = validatePayload(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: validation.errors,
    };
  }

  // Check configuration
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  const scriptToken = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN;

  if (!scriptUrl) {
    console.error('NEXT_PUBLIC_GOOGLE_SCRIPT_URL environment variable is not set');
    return { success: false, error: 'Booking service not configured' };
  }

  if (!scriptToken) {
    console.error('NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN environment variable is not set');
    return { success: false, error: 'Booking service not configured' };
  }

  // Build URL with token
  const urlWithToken = `${scriptUrl}?token=${encodeURIComponent(scriptToken)}`;

  try {
    // Apps Script Web Apps require special handling:
    // 1. Must use 'no-cors' mode OR handle redirects
    // 2. The script returns a redirect, so we use 'follow'
    // 3. For CORS to work, the Apps Script must be deployed with "Anyone" access
    const response = await fetch(urlWithToken, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain', // Apps Script handles this better than application/json
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        selectedDate: payload.selectedDate,
        sessionType: payload.sessionType,
      }),
      redirect: 'follow',
    });

    // Check if response is ok
    if (!response.ok) {
      console.error('Apps Script HTTP error:', response.status);
      return { success: false, error: 'Failed to submit booking' };
    }

    const data = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      console.error('Apps Script error:', data.error);
      return { success: false, error: data.error || 'Failed to submit booking' };
    }
  } catch (error) {
    console.error('Booking submission error:', error);

    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Unable to connect to booking service. Please check your internet connection.',
      };
    }

    return {
      success: false,
      error: 'Unable to connect to booking service. Please try again.',
    };
  }
}

// ============================================================================
// React Hook for Booking Submission
// ============================================================================

import { useState, useCallback } from 'react';

export interface UseBookingSubmissionState {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
}

export interface UseBookingSubmissionReturn extends UseBookingSubmissionState {
  submit: (payload: BookingPayload) => Promise<boolean>;
  reset: () => void;
}

/**
 * React hook for managing booking submission state.
 *
 * @example
 * ```tsx
 * function BookingForm() {
 *   const { submit, isLoading, error, fieldErrors, reset } = useBookingSubmission();
 *
 *   const handleSubmit = async () => {
 *     const success = await submit({
 *       name,
 *       email,
 *       phone,
 *       selectedDate: formatDateForBooking(date),
 *       sessionType: 'Workshop'
 *     });
 *
 *     if (success) {
 *       // Navigate to confirmation
 *     }
 *   };
 *
 *   return (
 *     <form>
 *       {error && <div className="error">{error}</div>}
 *       {fieldErrors?.email && <div className="field-error">{fieldErrors.email}</div>}
 *       <button onClick={handleSubmit} disabled={isLoading}>
 *         {isLoading ? 'Submitting...' : 'Book Now'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useBookingSubmission(): UseBookingSubmissionReturn {
  const [state, setState] = useState<UseBookingSubmissionState>({
    isLoading: false,
    error: null,
    fieldErrors: null,
  });

  const submit = useCallback(async (payload: BookingPayload): Promise<boolean> => {
    setState({ isLoading: true, error: null, fieldErrors: null });

    const result = await submitBooking(payload);

    if (result.success) {
      setState({ isLoading: false, error: null, fieldErrors: null });
      return true;
    }

    setState({
      isLoading: false,
      error: result.error || 'Submission failed',
      fieldErrors: result.fieldErrors || null,
    });
    return false;
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, fieldErrors: null });
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}
