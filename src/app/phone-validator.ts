/**
 * Shared Indian mobile number validation, used by every booking/enquiry
 * form (`appointment-booking`, `health-check-booking`,
 * `quick-appointment-booking`) so "only Indian numbers" is enforced the
 * same way everywhere instead of each form doing its own ad-hoc
 * digit-count check.
 *
 * A valid Indian mobile number is exactly 10 digits, the first of which is
 * 6, 7, 8 or 9 (landline numbers, and mobile numbers from any other
 * country, are rejected). The visitor is allowed to type it with a
 * leading `+91`, `91`, or a single trunk `0` - all three are stripped
 * before the check - and with spaces/hyphens for readability
 * (e.g. "+91 98765 43210" or "0987-654-3210").
 */
export function isValidIndianMobile(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;

  // Only digits, spaces, hyphens and a single leading "+" are legitimate in
  // a phone number - anything else (letters, other symbols) is an
  // immediate reject rather than being silently stripped out.
  if (!/^\+?[\d\s-]+$/.test(trimmed)) return false;

  let digits = trimmed.replace(/[\s-]/g, '');

  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('+')) {
    // Some other country's code (+1, +44, ...) - not an Indian number.
    return false;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return /^[6-9]\d{9}$/.test(digits);
}

/** Standard error message shown under a phone field that fails the check above. */
export const INDIAN_MOBILE_ERROR = 'Enter a valid 10-digit Indian mobile number.';
