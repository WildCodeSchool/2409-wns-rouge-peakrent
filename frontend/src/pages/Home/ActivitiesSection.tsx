import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { homeActivities } from "./fakeData";

const ActivityItem = ({
  activity,
  index,
}: {
  activity: any;
  index?: number;
}) => {
  return (
    <a
      key={activity.title}
      href={`/activities/${activity.title}`}
      className={cn(
        "aspect-square relative hover:cursor-pointer group overflow-hidden col-span-1",
        index !== undefined &&
          index !== null &&
          `col-start-[${index + 2}] col-span-2`
      )}
    >
      <div className="w-full h-full overflow-hidden rounded-full border">
        <ImageHandler
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center rounded-full">
          <p className="text-white text-lg font-semibold text-center px-4">
            {activity.title}
          </p>
        </div>
      </div>
    </a>
  );
};

export default function ActivitiesSection() {
  const [windowWidth, setWindowWidth] = useState(0);

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
          {homeActivities
            .slice(0, Math.ceil(getActivitiesCount() / 2))
            .map((activity) => (
              <ActivityItem key={activity.title} activity={activity} />
            ))}
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4 mx-auto">
          {homeActivities
            .slice(Math.ceil(getActivitiesCount() / 2), getActivitiesCount())
            .map((activity, index) => {
              return (
                <ActivityItem
                  key={activity.title}
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
