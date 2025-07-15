import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { activitiesSectionSpans } from "../homeDatas";

export function ActivitiesSectionSkeleton() {
  const [windowWidth, setWindowWidth] = useState(0);

  // TODO create hook for this
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getActivitiesCount = () => {
    if (windowWidth >= 768) return 9;
    if (windowWidth >= 640) return 7;
    return 5;
  };
  return (
    <section className="container mx-auto sm:px-4 max-w-screen-xl">
      <h2 className="!text-2xl md:!text-3xl font-bold my-4 md:my-6 text-center">
        Activités
      </h2>
      <div className="flex flex-col gap-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
          {[...Array(Math.ceil(getActivitiesCount() / 2))].map((_, index) => (
            <div
              key={index}
              className="aspect-square relative overflow-hidden rounded-full border"
            >
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4">
          {[...Array(Math.ceil(getActivitiesCount() / 2 - 1))].map(
            (_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square relative overflow-hidden rounded-full border col-span-2",
                  activitiesSectionSpans[index]
                )}
              >
                <Skeleton className="w-full h-full" />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
