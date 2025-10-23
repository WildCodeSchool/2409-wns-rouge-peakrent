import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel/Carousel";
import { NavLink } from "react-router-dom";
import { ForwardProducts } from "./ForwardProducts";
import { HomeActivities } from "./HomeActivities";
import { carousselImages } from "./homeDatas";
import { RentalProcessFlow } from "./RentalProcess";

export function HomePage() {
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
        <Button
          asChild
          variant="primary"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:hidden"
        >
          <NavLink
            to="/products"
            aria-label="Voir tous les équipements disponibles"
          >
            Voir les équipements
          </NavLink>
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col gap-4">
        <HomeActivities />

        <ForwardProducts />
        <RentalProcessFlow />
      </div>
    </>
  );
}
