import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { TouchEvent, useEffect, useState } from "react";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  imageClassName?: string;
}

export function Carousel({
  images,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className = "",
  imageClassName = "",
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  return (
    <section
      className={cn(`relative w-full ${className}`)}
      data-carousel="slide"
    >
      <div
        className="relative h-60 sm:h-70 md:h-80 lg:h-90 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`${
              index === currentSlide ? "block" : "hidden"
            } duration-700 ease-in-out h-full`}
            data-carousel-item
          >
            <img
              src={image.src}
              className={cn(
                `absolute block w-full h-full object-cover`,
                imageClassName
              )}
              loading="lazy"
              alt={image.alt}
            />
          </div>
        ))}
        {showControls && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center rounded-full px-4 cursor-pointer opacity-50 hover:opacity-100 border-none hover:ring-0"
              onClick={prevSlide}
            >
              <ChevronLeftIcon className="size-4 flex-none lg:size-5 text-primary" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center rounded-full px-4 cursor-pointer opacity-50 hover:opacity-100 hover:ring-0"
              onClick={nextSlide}
            >
              <ChevronRightIcon className="size-4 flex-none lg:size-5 text-primary" />
              <span className="sr-only">Next</span>
            </Button>
          </>
        )}
      </div>
      {showIndicators && (
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          {images.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                `w-3 h-3 rounded-full p-0`,
                index === currentSlide ? "bg-white" : "bg-white/50"
              )}
              aria-current={index === currentSlide}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
