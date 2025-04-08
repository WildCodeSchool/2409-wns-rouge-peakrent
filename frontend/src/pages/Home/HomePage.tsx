import { Carousel } from "@/components/ui/carousel/Carousel";
import ActivitiesSection from "./ActivitiesSection";
import ForwardProducts from "./ForwardProducts";
import { carousselImages } from "./fakeData";

export function HomePage() {
  return (
    <>
      <Carousel
        images={carousselImages}
        className="border-b-2 border-secondary"
        imageClassName="object-cover"
      />
      <ActivitiesSection />
      <ForwardProducts />
    </>
  );
}
