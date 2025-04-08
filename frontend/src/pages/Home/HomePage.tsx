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
      <Carousel
        images={carousselImages}
        className="border-b-2"
        imageClassName="object-cover"
      />
      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col gap-4">
        {lg ? <ActivitiesBentoGrid /> : <ActivitiesSection />}

        <ForwardProducts />
        <RentalProcessFlow />
      </div>
    </>
  );
}
