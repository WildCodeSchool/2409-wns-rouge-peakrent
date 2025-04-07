import { getNestedValueFunction } from "./getNestedValue";

/**
 * Default function to format a price value.
 *
 * - If the value is `null` or `undefined`, it returns `"--"`.
 * - If the value is a string, it attempts to convert it to a number.
 * - If the conversion is successful, it returns the number formatted with two decimal places.
 * - If the conversion fails (e.g., non-numeric string), it returns `"--"`.
 *
 * @param {any} row - The row data containing the original value.
 * @param {any} accessorKey - The key used to retrieve the price value from the row.
 * @returns {string} - The formatted price string.
 *
 * @example
 * const price = defaultPriceFn({ original: { price: "12.345" } }, "price");
 * console.log(price); // "12.35"
 */

export function defaultPriceFn(row: any, accessorKey: any): string {
  const value = getNestedValueFunction(row.original, accessorKey);
  if (value === null || value === undefined) return "--";
  const numericValue = typeof value === "string" ? Number(value) : value;

  return isNaN(numericValue) ? "--" : numericValue.toFixed(2);
}
