import { cn } from "@/lib/utils";
import React from "react";

const Box = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cn(className)} ref={ref} {...props} />
));

Box.displayName = "Box";

export { Box };
