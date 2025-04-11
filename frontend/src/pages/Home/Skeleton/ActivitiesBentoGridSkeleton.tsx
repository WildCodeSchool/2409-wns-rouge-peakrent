import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ActivitiesBentoGridSkeleton() {
  const spans = [
    "row-span-2 col-span-3",
    "col-span-3",
    "col-span-2",
    "col-span-2",
    "col-span-2",
    "col-span-2",
    "col-span-3",
  ];
  return (
    <section className="container mx-auto sm:px-4 max-w-screen-xl">
      <Skeleton className="h-8 md:h-9 w-32 mx-auto my-4 md:my-6" />
      <div className="grid grid-cols-10 gap-4 auto-rows-[250px]">
        {spans.map((span, index) => (
          <div
            key={index}
            className={cn("relative overflow-hidden rounded-xl border", span)}
          >
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
