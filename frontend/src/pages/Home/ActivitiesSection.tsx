import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { Activity as ActivityType } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { activitiesSectionSpans } from "./homeDatas";

const ActivityItem = ({
  activity,
  index,
}: {
  activity: ActivityType;
  index?: number;
}) => {
  return (
    <NavLink
      key={activity.id}
      to={`/activities/${activity.normalizedName}`}
      className={cn(
        "aspect-square relative hover:cursor-pointer group overflow-hidden",
        index !== undefined && index !== null && "col-span-2",
        index !== undefined && index !== null && activitiesSectionSpans[index]
      )}
    >
      <div className="w-full h-full overflow-hidden rounded-full border">
        <ImageHandler
          src={activity.urlImage}
          alt={activity.name}
          className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center rounded-full">
          <p className="text-white text-lg font-semibold text-center px-4">
            {activity.name}
          </p>
        </div>
      </div>
    </NavLink>
  );
};

export function ActivitiesSection({
  activities,
}: {
  activities: ActivityType[];
}) {
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
      <h2 className="!text-2xl md:!text-3xl font-bold my-4 md:py-6 text-center">
        Activités
      </h2>

      <div className="flex flex-col gap-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
          {activities
            ?.slice(0, Math.ceil(getActivitiesCount() / 2))
            .map((activity) => (
              <ActivityItem key={activity.name} activity={activity} />
            ))}
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4 mx-auto">
          {activities
            ?.slice(Math.ceil(getActivitiesCount() / 2), getActivitiesCount())
            .map((activity, index) => {
              return (
                <ActivityItem
                  key={activity.name}
                  activity={activity}
                  index={index}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}
