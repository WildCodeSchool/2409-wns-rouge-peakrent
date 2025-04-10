/**
 * Truncates a string to a specified length, adding an ellipsis ("...") in the middle if the string is too long.
 *
 * This function ensures that the resulting string maintains the beginning and end portions, while truncating the
 * middle part with an ellipsis if the string exceeds twice the specified number.
 *
 * @param string - The string to be truncated.
 * @param number - The number of characters to keep at the beginning and end of the string (default is 5).
 * @returns A new string with the middle part truncated and replaced by ellipses if necessary, otherwise returns the original string.
 *
 * Example:
 * ```ts
 * truncateTextWithEllipsisMiddle("Hello, this is a long string", 5);
 * // Returns "Hello...ring"
 *
 * truncateTextWithEllipsisMiddle("Short text", 5);
 * // Returns "Short text"
 *
 * truncateTextWithEllipsisMiddle("", 5);
 * // Returns ""
 * ```
 */

export default function truncateTextWithEllipsisMiddle(
  string: string,
  number: number = 5
): string {
  if (number <= 0 || !string) {
    return string;
  }
  if (string.length <= number * 2) {
    return string;
  }
  const firstPart = string.slice(0, number);
  const lastPart = string.slice(-number);

  return `${firstPart}...${lastPart}`;
}
