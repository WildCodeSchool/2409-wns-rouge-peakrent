import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import type { Category as CategoryType } from "@/gql/graphql";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { useProductFilters } from "@/hooks/useProductFilters";
import { gql, useQuery } from "@apollo/client";

export default function ProductsPage() {
  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const categories: CategoryType[] = catData?.getCategories?.categories ?? [];

  const {
    filters,
    categoryIds,
    paging,
    variables,
    applyFilters,
    clearFilters,
    setPage,
    setItemsPerPage,
  } = useProductFilters({ categories });

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

  const products = prodData?.getPublishedProducts?.products ?? [];
  const maxPage = prodData?.getPublishedProducts?.pagination?.totalPages ?? 0;

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
              selectedCategories={categoryIds}
              selectedStartingDate={filters.startingDate}
              selectedEndingDate={filters.endingDate}
              onApply={applyFilters}
              onClear={clearFilters}
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
            selectedCategories={categoryIds}
            selectedStartingDate={filters.startingDate}
            selectedEndingDate={filters.endingDate}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </aside>

        <div className="flex-1 px-4 pb-4">
          {products.length > 0 ? (
            <ProductsList
              title="Tous les produits"
              items={products}
              itemsOnPage={paging.onPage}
              setItemsOnPage={setItemsPerPage}
              pageIndex={paging.page}
              setPageIndex={setPage}
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
