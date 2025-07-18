import { ActivityCard } from "@/components/cards/ActivityCard";
import { GET_ACTIVITIES } from "@/graphQL/activities";
import { Activity as ActivityType } from "@/gql/graphql";
import { gql, useQuery } from "@apollo/client";

export default function ActivitiesPage() {
  const { data, loading, error } = useQuery(gql(GET_ACTIVITIES), {
    variables: {
      data: {
        page: 1,
        onPage: 20,
        sort: "name",
        order: "ASC",
      },
    },
  });

  const activities = data?.getActivities?.activities || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !activities.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h2>
          <p className="text-gray-600">Impossible de charger les activités</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 md:px-8 py-3 md:py-6 bg-white">
        <h1 className="font-semibold text-lg md:text-2xl">Activités</h1>
      </div>

      {/* Content */}
      <div className="px-4 md:p-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
          {activities.map((activity: ActivityType) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
