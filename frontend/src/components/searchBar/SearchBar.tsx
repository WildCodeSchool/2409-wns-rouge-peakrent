import { Skeleton } from "@/components/ui";
import AsyncSearchBar from "@/components/ui/AsyncSearchBar";
import { Product as ProductType } from "@/gql/graphql";
import { GET_PRODUCTS } from "@/graphQL";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export const SearchBar = () => {
  const [fetchProducts] = useLazyQuery(gql(GET_PRODUCTS));

  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      return {
        data: [],
        success: false,
        message: "Veuillez saisir un terme de recherche",
      };
    }

    try {
      const { data } = await fetchProducts({
        variables: { search: query },
      });

      if (!data?.getProducts?.products) {
        return {
          data: [],
          success: false,
          message: "Aucun résultat trouvé",
        };
      }

      const searchResults: ProductType[] = data?.getProducts?.products;

      return {
        data: searchResults,
        success: true,
        message: "Résultats trouvés",
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: "Erreur lors de la recherche",
      };
    }
  };

  return (
    <div className="w-full ml-4 mr-auto">
      <AsyncSearchBar
        fetchResults={fetchResults}
        placeholder={"Rechercher un produit"}
        skeletonItems={
          <>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="my-1 h-10 w-full" />
            ))}
          </>
        }
        renderItem={(item) => (
          <Link
            to={`/products/${item.id}`}
            aria-label={`Voir les détails du produit ${item.name}`}
          >
            <div className="grid w-full min-w-[300px] max-w-[300px] grid-cols-12 items-center">
              {item.urlImage && (
                <img
                  src={item.urlImage}
                  alt={item.name}
                  loading="lazy"
                  className="col-span-2 size-8"
                  width={32}
                  height={32}
                />
              )}
              <span className="col-span-9 truncate">{item.name}</span>
            </div>
          </Link>
        )}
      />
    </div>
  );
};
