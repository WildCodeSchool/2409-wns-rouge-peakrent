import { useRef } from "react";

type DoubleClickHandler = (e: React.MouseEvent) => void;

/**
 * useDoubleClick
 *
 * A custom hook to handle both single and double clicks on an element.
 * It distinguishes between single and double clicks based on a configurable delay.
 *
 * @param {Function} onSingleClick - The function to be executed on a single click (if double-click is not detected within the delay).
 * @param {Function} onDoubleClick - The function to be executed on a double-click (if detected within the delay).
 * @param {number} delay - The delay (in milliseconds) to distinguish between single and double clicks (default is 300ms).
 *
 * @returns {Function} handleClick - A function to be attached to the `onClick` event of the element to handle clicks.
 *
 * @example
 * import { useDoubleClick } from './hooks/useDoubleClick';
 *
 * function MyComponent() {
 *   const handleSingleClick = () => {
 *     console.log("Single Clicked!");
 *   };
 *
 *   const handleDoubleClick = () => {
 *     console.log("Double Clicked!");
 *   };
 *
 *   const handleClick = useDoubleClick(handleSingleClick, handleDoubleClick);
 *
 *   return <button onClick={handleClick}>Click me!</button>;
 * }
 */

export function useDoubleClick(
  onSingleClick?: DoubleClickHandler,
  onDoubleClick?: DoubleClickHandler,
  delay: number = 300
): (e: React.MouseEvent) => void {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onDoubleClick?.(e);
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        onSingleClick?.(e);
      }, delay);
    }
  };

  return handleClick;
}
