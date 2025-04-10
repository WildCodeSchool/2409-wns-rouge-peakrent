/**
 * Formats a size string by converting decimal values to their corresponding fractional notation.
 *
 * The function takes a string representing a size, and if the string contains a decimal number, it replaces specific decimals
 * (such as 0.3, 0.7, 0.25, 0.75) with their equivalent fraction symbols (⅓, ⅔, ¼, ¾). If the string doesn't contain a decimal number,
 * or if the decimal doesn't match any of the predefined values, the function returns the size as-is.
 *
 * @param size - The string representing the size, which may contain decimals to be converted to fractions.
 * @returns A string where decimal values are replaced by corresponding fractions, or the original size if no conversion is needed.
 *
 * Example:
 * ```ts
 * formatSize("5.3"); // Returns "5 ⅓"
 * formatSize("2.7"); // Returns "2 ⅔"
 * formatSize("1.25"); // Returns "1 ¼"
 * formatSize("4.75"); // Returns "4 ¾"
 * formatSize("10"); // Returns "10"
 * ```
 */

export function formatSize(size: string) {
  if (!size) return size;
  const fractionMap = {
    0.3: "⅓",
    0.7: "⅔",
    0.25: "¼",
    0.75: "¾",
  };

  return size?.replace(/\d+(\.\d+)?/g, (match) => {
    const [whole, decimal] = match.split(".");
    if (!decimal) return match;

    const fractionKey = parseFloat(`0.${decimal}`);
    const fraction = fractionMap[fractionKey as keyof typeof fractionMap];

    return fraction ? `${whole || 0} ${fraction}` : match;
  });
}
