import { ProductCard } from "@/components/cards/ProductCard";
import { Button } from "@/components/ui/button";
import { GET_MINIMAL_PRODUCTS_WITH_PAGING } from "@/GraphQL/products";
import { ProductType } from "@/types/types";
import { gql, useQuery } from "@apollo/client";
import { Meh } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
    if (windowWidth >= 1024) return 8;
    return 6;
  };

  const { data, loading, error } = useQuery(
    gql(GET_MINIMAL_PRODUCTS_WITH_PAGING),
    {
      variables: {
        page: 1,
        onPage: 8,
      },
    }
  );

  const products = data?.getProducts?.products || [];
  const displayedProducts = products
    .filter((product: ProductType) => product.isPublished)
    .slice(0, getProductCount());

  return (
    <section className="container mx-auto sm:px-4 max-w-screen-xl">
      <h2 className="!text-2xl md:!text-3xl font-bold my-4 md:my-6 text-center">
        Produits en avant
      </h2>
      <div className="mt-4 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {forwardProducts.map((product: any) => (
          <ProductCard product={product} key={product.id} />
        ))}
        {loading ? (
          <div className="col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
            <span className="font-medium">Chargement...</span>
          </div>
        ) : error ? (
          <div className="col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
            <Meh size={48} />
            <span className="font-medium">
              Erreur lors du chargement des produits
            </span>
          </div>
        ) : displayedProducts?.length ? (
          displayedProducts.map((product: ProductType) => (
            <ProductCard product={product} key={product.id} />
          ))
        ) : (
          <div className="col-span-full my-10 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
            <Meh size={48} />
            <span className="font-medium">Aucun produit</span>
          </div>
        )}
      </div>
      <NavLink to="/products">
        <Button
          variant="primary"
          size="lg"
          className="px-4 mx-auto block mt-6 rounded-lg w-full max-w-[300px]"
        >
          Voir Plus
        </Button>
      </NavLink>
    </section>
  );
}
