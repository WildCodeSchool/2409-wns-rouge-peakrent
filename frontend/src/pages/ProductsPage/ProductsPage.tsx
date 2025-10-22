import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import type { Category as CategoryType } from "@/gql/graphql";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Filters = {
  categoryIds: number[];
  categoryNames?: string[];
  startingDate?: string;
  endingDate?: string;
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({ categoryIds: [] });
  const [paging, setPaging] = useState({ page: 1, onPage: 15 });

  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const categories: CategoryType[] = catData?.getCategories?.categories ?? [];

  useEffect(() => {
    const categoryNames =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const startingDate = searchParams.get("startDate") || undefined;
    const endingDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const onPage = parseInt(searchParams.get("onPage") || "15");

    setFilters({ categoryIds: [], categoryNames, startingDate, endingDate });
    setPaging({ page, onPage });
  }, [searchParams]);

  useEffect(() => {
    if (
      filters.categoryNames &&
      filters.categoryNames.length > 0 &&
      categories.length > 0
    ) {
      const categoryIds = filters.categoryNames.flatMap((name) => {
        const id = categories.find((cat) => cat.normalizedName === name)?.id;
        return id !== undefined ? [Number(id)] : [];
      });
      setFilters((prev) => ({ ...prev, categoryIds }));
    }
  }, [categories, filters.categoryNames]);

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

  const updateURL = useCallback(
    (newFilters: Filters, newPaging: { page: number; onPage: number }) => {
      const params = new URLSearchParams();

      if (newFilters.categoryIds.length > 0) {
        const categoryNames = newFilters.categoryIds
          .map(
            (id) =>
              categories.find((cat) => Number(cat.id) === id)?.normalizedName
          )
          .filter(Boolean);
        if (categoryNames.length > 0) {
          params.set("categories", categoryNames.join(","));
        }
      }
      if (newFilters.startingDate) {
        params.set("startDate", newFilters.startingDate);
      }
      if (newFilters.endingDate) {
        params.set("endDate", newFilters.endingDate);
      }
      if (newPaging.page > 1) {
        params.set("page", newPaging.page.toString());
      }
      if (newPaging.onPage !== 15) {
        params.set("onPage", newPaging.onPage.toString());
      }

      setSearchParams(params);
    },
    [setSearchParams, categories]
  );

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

      const newFilters = {
        categoryIds,
        startingDate: startingDate
          ? new Date(startingDate).toISOString()
          : undefined,
        endingDate: endingDate ? new Date(endingDate).toISOString() : undefined,
      };

      const newPaging = { page: 1, onPage: paging.onPage };

      setFilters(newFilters);
      setPaging(newPaging);
      updateURL(newFilters, newPaging);
    },
    [paging.onPage, updateURL]
  );

  const clearFilters = useCallback(() => {
    const newFilters = { categoryIds: [] };
    const newPaging = { page: 1, onPage: paging.onPage };

    setFilters(newFilters);
    setPaging(newPaging);
    updateURL(newFilters, newPaging);
  }, [paging.onPage, updateURL]);

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
            selectedCategories={filters.categoryIds}
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
              setItemsOnPage={(n) => {
                const newPaging = { ...paging, onPage: n, page: 1 };
                setPaging(newPaging);
                updateURL(filters, newPaging);
              }}
              pageIndex={paging.page}
              setPageIndex={(n) => {
                const newPaging = { ...paging, page: n };
                setPaging(newPaging);
                updateURL(filters, newPaging);
              }}
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
