import { cn } from "@/lib/utils";
import { Meh } from "lucide-react";

export default function MehSection({
  text,
  className,
  size = 48,
}: {
  text: string;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl",
        className
      )}
    >
      <Meh size={size} />
      <span className="font-medium">{text}</span>
    </div>
  );
}
