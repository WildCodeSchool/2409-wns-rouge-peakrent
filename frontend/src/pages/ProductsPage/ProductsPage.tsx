import { gql, useQuery } from "@apollo/client";
import { useMemo, useCallback, useState, startTransition } from "react";
import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import ProductsList from "@/components/productsList/ProductsList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import type { Category as CategoryType } from "@/gql/graphql";
import { toast } from "sonner";

type Filters = {
  categoryIds: number[];
  startingDate?: string;
  endingDate?: string;
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({ categoryIds: [] });
  const [paging, setPaging] = useState({ page: 1, onPage: 15 });

  const variables = useMemo(
    () => ({
      page: paging.page,
      onPage: paging.onPage,
      categoryIds: filters.categoryIds.length ? filters.categoryIds : undefined,
      startingDate: filters.startingDate,
      endingDate: filters.endingDate,
    }),
    [paging.page, paging.onPage, filters]
  );

  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const {
    data: prodData,
    loading: prodLoading,
    error: prodError,
    networkStatus,
  } = useQuery(gql(GET_PUBLISHED_PRODUCTS_WITH_PAGING), {
    variables,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const categories: CategoryType[] = catData?.getCategories?.categories ?? [];

  const products = prodData?.getPublishedProducts?.products ?? [];
  const maxPage = prodData?.getPublishedProducts?.pagination?.totalPages ?? 0;

  const applyFilters = useCallback(
    (params: {
      categoryIds: number[];
      startingDate?: string;
      endingDate?: string;
    }) => {
      const { categoryIds, startingDate, endingDate } = params;
      if (
        startingDate &&
        endingDate &&
        new Date(startingDate) > new Date(endingDate)
      ) {
        toast.error(
          "La date de fin ne peut pas être inférieure à celle de début"
        );
        return;
      }
      setFilters({
        categoryIds,
        startingDate: startingDate
          ? new Date(startingDate).toISOString()
          : undefined,
        endingDate: endingDate ? new Date(endingDate).toISOString() : undefined,
      });
      startTransition(() => setPaging((p) => ({ ...p, page: 1 })));
    },
    []
  );

  if (catError) return <div>Erreur lors du chargement des catégories.</div>;
  if (prodError) return <div>Erreur lors du chargement des produits.</div>;

  if (catLoading || (prodLoading && networkStatus === 1)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadIcon size={40} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex-row items-center justify-between h-10 px-2.5 md:hidden flex">
        <FilterButton
          text="Filtrer"
          modalContent={() => (
            <FilterList
              categories={categories}
              selectedCategories={filters.categoryIds}
              selectedStartingDate={filters.startingDate}
              selectedEndingDate={filters.endingDate}
              onApply={applyFilters}
            />
          )}
          ariaLabel="editCategoryAriaLabel"
          variant="primary"
          modalTitle="Filtrer les produits"
          modalDescription="Filtrer"
          className="flex md:hidden text-base w-fit px-3"
        />
      </div>

      <div className="flex">
        {/* Desktop */}
        <aside className="hidden md:block w-[250px] bg-gray-100 p-4">
          <FilterList
            categories={categories}
            selectedCategories={filters.categoryIds}
            selectedStartingDate={filters.startingDate}
            selectedEndingDate={filters.endingDate}
            onApply={applyFilters}
          />
        </aside>

        <div className="flex-1 px-4 pb-4">
          {products.length > 0 ? (
            <ProductsList
              title="Tous les produits"
              items={products}
              itemsOnPage={paging.onPage}
              setItemsOnPage={(n) => setPaging((p) => ({ ...p, onPage: n }))}
              pageIndex={paging.page}
              setPageIndex={(n) => setPaging((p) => ({ ...p, page: n }))}
              maxPage={maxPage}
            />
          ) : (
            <p className="text-center text-gray-500">
              Aucun produit ne correspond à vos filtres.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
