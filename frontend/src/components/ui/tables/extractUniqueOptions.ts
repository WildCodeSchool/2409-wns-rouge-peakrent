/**
 * Extracts unique values from an array, filters out null or undefined,
 * and maps the values to a specified format.
 *
 * @param array - The array of objects to extract data from.
 * @param key - The key to extract unique values from.
 * @param transformFn - Optional function to transform the value (e.g., for formatting).
 * @returns An array of objects with `value` and `label` properties.
 */
export function extractUniqueOptions<T, K extends keyof T>(
  array: T[],
  key: K,
  transformFn?: (value: string) => string | React.JSX.Element
): { value: string; label: string | React.JSX.Element }[] {
  return Array.from(
    new Set(
      array
        .map((item) => item[key])
        .filter(
          (value): value is Exclude<T[K], null | undefined> => value != null
        )
    )
  )
    .map((value) => {
      const stringValue = String(value);
      return {
        value: stringValue,
        label: transformFn ? transformFn(stringValue) : stringValue,
      };
    })
    .filter((item) => item.value !== "null" && item.value !== "");
}
