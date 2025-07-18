import { Button } from "@/components/ui/button";
import { Activity as ActivityType } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface ActivityCardProps {
  activity: ActivityType;
  className?: string;
  showButton?: boolean;
}

export function ActivityCard({ 
  activity, 
  className,
  showButton = true
}: ActivityCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-gray-100 rounded-lg p-4 md:p-6 overflow-hidden",
        "flex flex-col justify-between min-h-[300px] md:min-h-[400px]",
        className
      )}
      style={{
        backgroundImage: `url(${activity.urlImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto'
      }}
        >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-bold text-left text-xl md:text-2xl mb-4 text-white">
            {activity.name}
          </h3>
        </div>
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-full">
            <p className="text-white text-sm md:text-base leading-relaxed">
              {activity.description }
            </p>
          </div>
          
          {showButton && (
            <div className="flex justify-center">
              <NavLink to={`/activities/${activity.normalizedName}`}>
                <Button
                  size="lg"
                  className="w-full md:w-auto text-sm md:text-base text-black rounded-lg relative z-10 px-6 py-3"
                  variant="outline"
                >
                  Découvrir
                </Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
