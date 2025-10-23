import { ProductCard } from "@/components/cards/ProductCard";
import { ProductCardSkeleton } from "@/components/cards/ProductCardSkeleton";
import MehSection from "@/components/section/MehSection";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Product as ProductType } from "@/gql/graphql";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { useWindowWidth } from "@/hooks";
import { gql, useQuery } from "@apollo/client";
import { Meh } from "lucide-react";
import { NavLink } from "react-router-dom";

export function ForwardProducts() {
  const windowWidth = useWindowWidth();

  const getProductCount = () => {
    if (windowWidth >= 1024) return 8;
    return 6;
  };

  const { data, loading, error } = useQuery(
    gql(GET_PUBLISHED_PRODUCTS_WITH_PAGING),
    {
      variables: {
        page: 1,
        onPage: 8,
      },
    }
  );

  const products = data?.getPublishedProducts?.products || [];
  const displayedProducts = products.slice(0, getProductCount());

  return (
    <section className="container mx-auto sm:px-4 max-w-screen-xl">
      <Title
        text="Produits en avant"
        className="my-4 md:my-6 justify-center"
        titleLevel="h2"
      />
      <div
        className="
    grid gap-4 auto-rows-min items-start 
    grid-cols-1 justify-items-center
    sm:[grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]
  "
      >
        {loading ? (
          [...Array(getProductCount())].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
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
          <div className="col-span-full">
            <MehSection text="Aucun produit" />
          </div>
        )}
      </div>

      <NavLink to="/products">
        <Button
          variant="primary"
          size="lg"
          aria-label="Voir plus de produits"
          className="px-4 mx-auto block mt-6 rounded-lg w-full max-w-[300px]"
        >
          Voir Plus
        </Button>
      </NavLink>
    </section>
  );
}
