import { useEffect, useState } from "react";

/**
 * Hook for getting and watching the window width
 * @returns The current window width in pixels
 */
export function useWindowWidth(): number {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}
