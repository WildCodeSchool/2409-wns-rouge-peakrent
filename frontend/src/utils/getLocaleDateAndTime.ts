/**
 * Formats a given date string into a locale-specific date and time format.
 *
 * The function takes a string representing a date (or null), converts it to a `Date` object,
 * and returns an object containing the formatted date and time in the local format. If the provided
 * date string is null or invalid, it returns empty strings for both the date and time.
 *
 * @param dateString - A string representing the date in any valid date format, or null.
 * @returns An object containing the formatted date and time. The properties are:
 *   - `date`: A string representing the date in the locale-specific format, or an empty string if the date is invalid or null.
 *   - `time`: A string representing the time in the locale-specific format, or an empty string if the date is invalid or null.
 *
 * Example:
 * ```ts
 * formatLocaleDate("2025-03-14T12:00:00Z");
 * // Returns { date: "3/14/2025", time: "12:00:00 PM" }
 *
 * formatLocaleDate(null);
 * // Returns { date: "", time: "" }
 * ```
 */

export const formatLocaleDate = (dateString: string | null) => {
  const date = dateString ? new Date(dateString) : null;
  return {
    date: date ? date.toLocaleDateString() : "",
    time: date ? date.toLocaleTimeString() : "",
  };
};
