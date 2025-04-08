import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel/Carousel";
import useBreakpoints from "@/hooks/useBreakpoint";
import ActivitiesBentoGrid from "./ActivitiesBentoGrid";
import ActivitiesSection from "./ActivitiesSection";
import { carousselImages } from "./fakeData";
import ForwardProducts from "./ForwardProducts";
import RentalProcessFlow from "./RentalProcess";

export function HomePage() {
  const { lg } = useBreakpoints();
  return (
    <>
      <div className="relative">
        <Carousel
          images={carousselImages}
          className="border-b-2"
          imageClassName="object-cover"
        />
        <h1 className="absolute top-12 sm:top-15 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:!text-7xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Peakrent
        </h1>
        <a href="/products">
          <Button
            variant="primary"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:hidden"
          >
            Voir les équipements
          </Button>
        </a>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col gap-4">
        {lg ? <ActivitiesBentoGrid /> : <ActivitiesSection />}

        <ForwardProducts />
        <RentalProcessFlow />
      </div>
    </>
  );
}
