import MehSection from "@/components/section/MehSection";
import { GET_ACTIVITIES } from "@/graphQL/activities";
import { useWindowWidth } from "@/hooks";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivitiesBentoGrid } from "./ActivitiesBentoGrid";
import { ActivitiesSection } from "./ActivitiesSection";
import { ActivitiesBentoGridSkeleton } from "./skeleton/ActivitiesBentoGridSkeleton";
import { ActivitiesSectionSkeleton } from "./skeleton/ActivitiesSectionSkeleton";

export function HomeActivities() {
  const windowWidth = useWindowWidth();
  const [showBentoGrid, setShowBentoGrid] = useState(windowWidth >= 768);

  const { data, error, loading } = useQuery(gql(GET_ACTIVITIES), {
    variables: {
      data: {
        page: 1,
        onPage: 7,
      },
    },
  });

  useEffect(() => {
    setShowBentoGrid(windowWidth >= 768);
  }, [windowWidth]);

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
