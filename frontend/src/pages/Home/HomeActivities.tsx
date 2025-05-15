import MehSection from "@/components/section/MehSection";
import { GET_ACTIVITIES } from "@/GraphQL/activities";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivitiesBentoGrid } from "./ActivitiesBentoGrid";
import { ActivitiesSection } from "./ActivitiesSection";
import { ActivitiesBentoGridSkeleton } from "./Skeleton/ActivitiesBentoGridSkeleton";
import { ActivitiesSectionSkeleton } from "./Skeleton/ActivitiesSectionSkeleton";

export function HomeActivities() {
  const [showBentoGrid, setShowBentoGrid] = useState(window.innerWidth >= 768);

  const { data, error, loading } = useQuery(gql(GET_ACTIVITIES), {
    variables: {
      data: {
        page: 1,
        onPage: 7,
      },
    },
  });

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
      <MehSection
        text="Erreur lors du chargement des activités"
        className="my-24"
      />
    );
  }
  return (
    <>
      {showBentoGrid ? (
        <ActivitiesBentoGrid activities={data?.getActivities.activities} />
      ) : (
        <ActivitiesSection activities={data?.getActivities.activities} />
      )}
    </>
  );
}
