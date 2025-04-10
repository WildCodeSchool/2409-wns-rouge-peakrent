import { useEffect, useState } from "react";
import useBreakpoints from "./useBreakpoint";

/**
 * useViewMode
 *
 * A custom hook that determines the view mode (either "table" or "card") based on the current screen size.
 * It uses the `useBreakpoints` hook to check if the screen size matches the "lg" breakpoint and updates the view mode accordingly.
 *
 * @returns {Object} - Returns an object containing:
 *   - `viewMode`: The current view mode, which will be "table" for large screens and "card" for smaller screens.
 *   - `setViewMode`: A function to manually set the view mode.
 *
 * @example
 * import { useViewMode } from './hooks/useViewMode';
 * import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
 * import { Grid2X2, LayoutGrid } from "lucide-react";
 * 
 * function MyComponent() {
 *   const { viewMode, setViewMode } = useViewMode();
 *
 *   return (
 *     <Tabs
          defaultValue="table"
          value={viewMode ?? "table"}
          onValueChange={(value) =>
            setViewMode && setViewMode(value as "table" | "card")
          }
          className="min-w-[64px]"
        >
          <TabsList className="border-input grid size-full grid-cols-2 gap-1 rounded-md border p-1">
            <TabsTrigger
              value="table"
              className="data-[state=active]:text-primary text-muted-foreground flex items-center gap-2 rounded-md p-1"
            >
              <Grid2X2 className="size-4" />
            </TabsTrigger>
            <TabsTrigger
              value="card"
              className="data-[state=active]:text-primary text-muted-foreground flex items-center gap-2 rounded-md p-1"
            >
              <LayoutGrid className="size-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
 *   );
 * }
 */

export function useViewMode() {
  const { lg } = useBreakpoints();
  const [viewMode, setViewMode] = useState<"table" | "card">(
    lg ? "table" : "card"
  );

  useEffect(() => {
    setViewMode(lg ? "table" : "card");
  }, [lg]);

  return { viewMode, setViewMode };
}
