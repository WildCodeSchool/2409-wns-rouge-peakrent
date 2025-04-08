import { ProductCard } from "@/components/cards/ProductCard";
import { Button } from "@/components/ui/button";
import { Meh } from "lucide-react";
import { useEffect, useState } from "react";
import { forwardProducts } from "./fakeData";

export default function ForwardProducts() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProductCount = () => {
    if (windowWidth >= 1280) return 10;
    if (windowWidth >= 1024) return 8;
    return 6;
  };
  return (
    <section className="py-4 px-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold text-center mb-4">Produits en avant</h2>
      <div className="mt-4 grid w-full max-w-screen-2xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {forwardProducts.length ? (
          forwardProducts.slice(0, getProductCount()).map((product) => (
            <a
              className="col-span-1 rounded-[5px]"
              href={product.slug}
              key={product.id}
            >
              <ProductCard product={product} />
            </a>
          ))
        ) : (
          <div className="col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
            <Meh size={48} />
            <span className="font-medium">Aucun produit</span>
          </div>
        )}
      </div>
      <a href="/products">
        <Button
          variant="primary"
          className="px-4 mx-auto block mt-4 rounded-lg"
        >
          Voir Plus
        </Button>
      </a>
    </section>
  );
}
