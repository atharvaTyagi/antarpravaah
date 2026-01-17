// ============================================================================
// Google Apps Script - Booking Form Handler
// ============================================================================
// This script receives booking data from the React app and appends it to
// a Google Sheet. Deploy as a Web App with "Anyone" access.
//
// Sheet columns (in order):
// A: Timestamp
// B: Name
// C: Email
// D: Phone
// E: Selected Date
// F: Session Type
// ============================================================================

// CONFIGURATION
// Replace with your own secret token (use a strong, random string)
const SECRET_TOKEN = 'YOUR_SECRET_TOKEN_HERE';

// ============================================================================
// Main POST Handler
// ============================================================================

/**
 * Handles incoming POST requests from the React booking form.
 * Validates the token and payload, then appends data to the sheet.
 *
 * @param {Object} e - The event object containing POST data
 * @returns {ContentService.TextOutput} JSON response
 */
function doPost(e) {
  try {
    // 1. Validate authentication token
    const token = e.parameter.token;
    if (!token || token !== SECRET_TOKEN) {
      return createJsonResponse({ success: false, error: 'Unauthorized' });
    }

    // 2. Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse({ success: false, error: 'Invalid JSON payload' });
    }

    // 3. Validate required fields
    const validationError = validatePayload(payload);
    if (validationError) {
      return createJsonResponse({ success: false, error: validationError });
    }

    // 4. Append to sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create timestamp in IST (Indian Standard Time)
    const timestamp = Utilities.formatDate(
      new Date(),
      'Asia/Kolkata',
      'yyyy-MM-dd HH:mm:ss'
    );

    // Append row: Timestamp, Name, Email, Phone, Selected Date, Session Type
    sheet.appendRow([
      timestamp,
      payload.name,
      payload.email,
      payload.phone,
      payload.selectedDate,
      payload.sessionType
    ]);

    return createJsonResponse({ success: true });

  } catch (error) {
    // Log error for debugging (viewable in Apps Script Execution log)
    console.error('doPost error:', error);
    return createJsonResponse({ success: false, error: 'Internal server error' });
  }
}

// ============================================================================
// GET Handler (for testing/health check)
// ============================================================================

/**
 * Handles GET requests - useful for testing if the Web App is deployed.
 *
 * @param {Object} e - The event object
 * @returns {ContentService.TextOutput} JSON response
 */
function doGet(e) {
  return createJsonResponse({
    success: true,
    message: 'Antar Pravaah Booking API is running',
    timestamp: new Date().toISOString()
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates the booking payload.
 *
 * @param {Object} payload - The booking data
 * @returns {string|null} Error message if validation fails, null if valid
 */
function validatePayload(payload) {
  // Check required fields exist
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim() === '') {
    return 'Name is required';
  }

  if (!payload.email || typeof payload.email !== 'string') {
    return 'Email is required';
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return 'Invalid email format';
  }

  if (!payload.phone || typeof payload.phone !== 'string' || payload.phone.trim() === '') {
    return 'Phone is required';
  }

  if (!payload.selectedDate || typeof payload.selectedDate !== 'string') {
    return 'Selected date is required';
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(payload.selectedDate)) {
    return 'Date must be in YYYY-MM-DD format';
  }

  if (!payload.sessionType || typeof payload.sessionType !== 'string') {
    return 'Session type is required';
  }

  // Validate session type values
  if (payload.sessionType !== 'Workshop' && payload.sessionType !== 'Training') {
    return 'Session type must be "Workshop" or "Training"';
  }

  return null; // Validation passed
}

/**
 * Creates a JSON response.
 * Note: Apps Script Web Apps automatically handle CORS when deployed with "Anyone" access.
 * The response will include proper CORS headers.
 *
 * @param {Object} data - The response data
 * @returns {ContentService.TextOutput} JSON response
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles OPTIONS preflight requests for CORS.
 * Apps Script doesn't natively support OPTIONS, but this is here for documentation.
 * The Web App handles CORS automatically when deployed with "Anyone" access.
 *
 * @param {Object} e - The event object
 * @returns {ContentService.TextOutput} Empty response
 */
function doOptions(e) {
  return ContentService.createTextOutput('');
}

// ============================================================================
// Setup Function (Run once to create headers)
// ============================================================================

/**
 * Run this function once to set up the sheet headers.
 * Go to: Run > Run function > setupSheet
 */
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Check if headers already exist
  const firstRow = sheet.getRange(1, 1, 1, 6).getValues()[0];
  if (firstRow[0] === 'Timestamp') {
    console.log('Headers already exist');
    return;
  }

  // Insert headers
  sheet.getRange(1, 1, 1, 6).setValues([[
    'Timestamp',
    'Name',
    'Email',
    'Phone',
    'Selected Date',
    'Session Type'
  ]]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 6);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');

  // Auto-resize columns
  for (let i = 1; i <= 6; i++) {
    sheet.autoResizeColumn(i);
  }

  console.log('Sheet setup complete');
}
