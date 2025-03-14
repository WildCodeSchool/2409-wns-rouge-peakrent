import { useEffect, useState } from "react";

/**
 * Custom hook to check if the current window width is greater than or equal to a specified breakpoint.
 *
 * @param breakpoint - The width threshold (in pixels) for the breakpoint.
 * @returns A boolean indicating whether the window width is greater than or equal to the breakpoint.
 */

function useBreakpoint(breakpoint: number) {
  const [isBreakpoint, setIsBreakpoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsBreakpoint(window.innerWidth >= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isBreakpoint;
}

const useBreakpoints = () => {
  const s = useBreakpoint(425);
  const sm = useBreakpoint(640);
  const md = useBreakpoint(768);
  const lg = useBreakpoint(1024);
  const xl = useBreakpoint(1280);
  const xxl = useBreakpoint(1536);

  return { s, sm, md, lg, xl, xxl };
};

export default useBreakpoints;
