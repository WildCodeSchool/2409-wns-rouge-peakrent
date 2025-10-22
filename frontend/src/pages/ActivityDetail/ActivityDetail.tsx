import FilterButton from "@/components/buttons/FilterButton";
import { ActivityCard } from "@/components/cards/ActivityCard";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import type { Category as CategoryType } from "@/gql/graphql";
import { GET_ACTIVITY_BY_NORMALIZED_NAME } from "@/graphQL/activities";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Filters = {
  categoryIds: number[];
  categoryNames?: string[];
  activityIds?: number[];
  startingDate?: string;
  endingDate?: string;
};

const ActivityDetail = () => {
  const { normalizedName } = useParams<{ normalizedName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>({ categoryIds: [] });
  const [paging, setPaging] = useState({ page: 1, onPage: 15 });

  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
  } = useQuery(gql(GET_ACTIVITY_BY_NORMALIZED_NAME), {
    variables: { normalizedName },
    skip: !normalizedName?.trim(),
  });
  const activity = activityData?.getActivityByNormalizedName;

  useEffect(() => {
    if (!activity?.id) return;
    setFilters((f) =>
      f.activityIds?.[0] === Number(activity.id)
        ? f
        : { ...f, activityIds: [Number(activity.id)] }
    );
    setPaging((p) => (p.page === 1 ? p : { ...p, page: 1 }));
  }, [activity?.id]);

  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const variables = useMemo(
    () => ({
      page: paging.page,
      onPage: paging.onPage,
      categoryIds: filters.categoryIds.length ? filters.categoryIds : undefined,
      activityIds: filters.activityIds,
      startingDate: filters.startingDate,
      endingDate: filters.endingDate,
    }),
    [paging, filters]
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
    skip: !filters.activityIds?.length,
  });

  const categories: CategoryType[] = catData?.getCategories?.categories ?? [];
  const products = prodData?.getPublishedProducts?.products ?? [];
  const maxPage = prodData?.getPublishedProducts?.pagination?.totalPages ?? 0;

  useEffect(() => {
    const categoryNames =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const startingDate = searchParams.get("startDate") || undefined;
    const endingDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const onPage = parseInt(searchParams.get("onPage") || "15");

    setFilters((prev) => ({
      ...prev,
      categoryIds: [],
      categoryNames,
      startingDate,
      endingDate,
    }));
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
        ...filters,
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
    [filters, paging.onPage, updateURL]
  );

  const clearFilters = useCallback(() => {
    const newFilters = {
      ...filters,
      categoryIds: [],
      startingDate: undefined,
      endingDate: undefined,
    };
    const newPaging = { page: 1, onPage: paging.onPage };

    setFilters(newFilters);
    setPaging(newPaging);
    updateURL(newFilters, newPaging);
  }, [filters, paging.onPage, updateURL]);

  if (activityError)
    return <div>Erreur lors du chargement de l&apos;activité.</div>;
  if (catError) return <div>Erreur lors du chargement des catégories.</div>;
  if (prodError) return <div>Erreur lors du chargement des produits.</div>;

  if (activityLoading || catLoading || (prodLoading && networkStatus === 1)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadIcon size={40} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Activité non trouvée
          </h2>
          <p className="text-gray-600">
            L&apos;activité demandée n&apos;existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 py-4 border-b">
        <h1 className="text-xl md:text-2xl font-bold">
          Activités / {activity.name}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row">
        <aside className="hidden md:block w-[280px] bg-gray-50 border-r p-6">
          <FilterList
            categories={categories}
            selectedCategories={filters.categoryIds}
            selectedStartingDate={filters.startingDate}
            selectedEndingDate={filters.endingDate}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="">
            <ActivityCard
              activity={activity}
              showButton={false}
              className="rounded-t-none mb-4"
            />
          </div>

          {/* Mobile */}
          <div className="md:hidden mb-4 px-4 md:px-8">
            <FilterButton
              text="Filtrer"
              modalContent={
                <FilterList
                  categories={categories}
                  selectedCategories={filters.categoryIds}
                  selectedStartingDate={filters.startingDate}
                  selectedEndingDate={filters.endingDate}
                  onApply={applyFilters}
                  onClear={clearFilters}
                />
              }
              ariaLabel="filterProductsAriaLabel"
              variant="primary"
              modalTitle="Filtrer les produits"
              modalDescription="Filtrer"
              className="w-full text-base"
            />
          </div>

          <div className="px-4 md:px-8 pb-8">
            {products.length > 0 ? (
              <ProductsList
                title="Produits associés"
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
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucun produit ne correspond à vos filtres.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
