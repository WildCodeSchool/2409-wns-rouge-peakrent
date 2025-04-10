import { useEffect, useRef } from "react";

/**
 * useClickOutside
 *
 * A custom hook to detect clicks outside a specified element and execute a callback function.
 *
 * @param {Function} callback - The function to be executed when a click outside the element is detected.
 * @param {React.RefObject[]} excludedRefs - Optional array of refs to exclude from the "outside" detection.
 * @returns {React.RefObject} - A ref to attach to the target element.
 *
 * @example
 * import { useClickOutside } from './hooks/useClickOutside';
 *
 * function MyComponent() {
 *   const ref = useClickOutside<HTMLDivElement>(() => {
 *     // Action to take when clicking outside
 *     setEditing(false);
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <p>Content inside the monitored element</p>
 *     </div>
 *   );
 * }
 */

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  excludedRefs: React.RefObject<T>[] = []
): React.RefObject<T> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideMain =
        ref.current && !ref.current.contains(e.target as Node);

      const isOutsideExcluded = excludedRefs.every(
        (excludedRef) =>
          excludedRef.current && !excludedRef.current.contains(e.target as Node)
      );

      if (isOutsideMain && isOutsideExcluded) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, excludedRefs]);

  return ref;
}
