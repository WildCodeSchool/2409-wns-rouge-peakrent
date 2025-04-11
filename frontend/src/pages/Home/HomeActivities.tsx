import { GET_CATEGORIES_WITH_COUNT } from "@/GraphQL/categories";
import { gql, useQuery } from "@apollo/client";
import { Meh } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivitiesBentoGrid } from "./ActivitiesBentoGrid";
import { ActivitiesSection } from "./ActivitiesSection";
import { ActivitiesBentoGridSkeleton } from "./Skeleton/ActivitiesBentoGridSkeleton";
import { ActivitiesSectionSkeleton } from "./Skeleton/ActivitiesSectionSkeleton";

export function HomeActivities() {
  const [showBentoGrid, setShowBentoGrid] = useState(window.innerWidth >= 768);

  const { data, error, loading } = useQuery(gql(GET_CATEGORIES_WITH_COUNT));

  useEffect(() => {
    const handleResize = () => {
      setShowBentoGrid(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return showBentoGrid ? (
      <ActivitiesBentoGridSkeleton />
    ) : (
      <ActivitiesSectionSkeleton />
    );
  }

  if (error) {
    return (
      <div className="col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
        <Meh size={48} />
        <span className="font-medium">
          Erreur lors du chargement des activités
        </span>
      </div>
    );
  }
  return (
    <>
      {showBentoGrid ? (
        <ActivitiesBentoGrid activities={data?.getCategories.categories} />
      ) : (
        <ActivitiesSection activities={data?.getCategories.categories} />
      )}
    </>
  );
}
