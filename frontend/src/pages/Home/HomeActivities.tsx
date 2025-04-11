import { useEffect, useState } from "react";
import { ActivitiesBentoGrid } from "./ActivitiesBentoGrid";
import { ActivitiesSection } from "./ActivitiesSection";
import { ActivitiesBentoGridSkeleton } from "./Skeleton/ActivitiesBentoGridSkeleton";
import { ActivitiesSectionSkeleton } from "./Skeleton/ActivitiesSectionSkeleton";

export function HomeActivities() {
  const [isLoading, setIsLoading] = useState(true);

  const [showBentoGrid, setShowBentoGrid] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setShowBentoGrid(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return showBentoGrid ? (
      <ActivitiesBentoGridSkeleton />
    ) : (
      <ActivitiesSectionSkeleton />
    );
  }

  return <>{showBentoGrid ? <ActivitiesBentoGrid /> : <ActivitiesSection />}</>;
}
