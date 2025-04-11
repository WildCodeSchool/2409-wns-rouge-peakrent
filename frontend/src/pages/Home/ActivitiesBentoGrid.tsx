import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { cn } from "@/lib/utils";
import { CategoryType } from "@/types/types";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function ActivitiesBentoGrid({
  activities,
}: {
  activities: CategoryType[];
}) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
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
      <h2 className="!text-2xl md:!text-3xl font-bold my-4 md:my-6 text-center">
        Activités
      </h2>
      <div className="grid grid-cols-10 gap-4 auto-rows-[250px]">
        {activities?.slice(0, 7).map((activity, index) => (
          <NavLink
            to={`/activities/${activity.name}`}
            key={activity.id}
            className={cn(
              "relative overflow-hidden rounded-xl border hover:cursor-pointer",
              spans[index] || ""
            )}
            onMouseEnter={() => setHoveredItem(activity.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ImageHandler
              src={activity.urlImage}
              alt={activity.name}
              className="object-cover transition-transform duration-500 hover:scale-110 h-full w-full"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300 ${
                hoveredItem === activity.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <h3 className="text-xl font-bold text-white">{activity.name}</h3>
              {/* <p className="text-sm text-white/90">{activity.description}</p> */}
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
