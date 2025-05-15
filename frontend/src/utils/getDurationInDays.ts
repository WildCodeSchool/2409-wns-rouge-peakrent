/**
 * Calculates the duration between two dates in days.
 *
 * - If both dates are provided, returns the number of days between them.
 * - If either date is missing or invalid, returns 1 by default.
 * - You can choose whether the result should be floored to the nearest whole number
 *   or rounded to two decimal places.
 *
 * @param {Date | string} start - The start date (JavaScript `Date` or ISO string).
 * @param {Date | string} end - The end date (JavaScript `Date` or ISO string).
 * @param {{ floor?: boolean }} [options={ floor: true }] - Calculation options.
 * @param {boolean} [options.floor=true] - If `true`, returns the floored integer result.
 *                                         If `false`, returns the value with two decimal places.
 * @returns {number} The duration in days, with a minimum of 0.
 *
 * @example
 * getDurationInDays('2025-05-10', '2025-05-12'); // 2
 * getDurationInDays('2025-05-10T12:00', '2025-05-11T18:00'); // 1.25
 * getDurationInDays('2025-05-10T12:00', '2025-05-11T18:00', { floor: true }); // 1
 */

export function getDurationInDays(
  start: Date | string,
  end: Date | string,
  options: { floor?: boolean } = { floor: true }
): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const msInDay = 1000 * 60 * 60 * 24;
  const diffInMs = endDate.getTime() - startDate.getTime();
  const rawDays = diffInMs / msInDay;

  if (options?.floor) {
    return Math.max(Math.floor(rawDays), 0);
  }

  const rounded = parseFloat(rawDays.toFixed(2));
  return Math.max(rounded, 0);
}
