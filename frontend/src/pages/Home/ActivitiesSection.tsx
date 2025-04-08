import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { useEffect, useState } from "react";
import { homeActivities } from "./fakeData";

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
    <section className="container mx-auto px-4 max-w-screen-xl">
      <h2 className="!text-2xl md:!text-3xl font-bold my-4 md:py-6 text-center">
        Activités
      </h2>

      <div className="relative space-y-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {homeActivities.slice(0, getActivitiesCount()).map((activity) => (
            <a
              key={activity.title}
              href={`/activities/${activity.title}`}
              className="aspect-square relative hover:cursor-pointer group overflow-hidden"
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
          ))}
        </div>
      </div>
    </section>
  );
}
