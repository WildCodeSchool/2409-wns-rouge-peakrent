import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import { ActivityCard } from "@/components/cards/ActivityCard";
import { GET_ACTIVITY_BY_NORMALIZED_NAME } from "@/graphQL/activities";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { gql, useQuery } from "@apollo/client";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

type Filters = {
  categoryIds: number[];
  activityIds?: number[];
  startingDate?: string;
  endingDate?: string;
};

const ActivityDetail = () => {
  const { normalizedName } = useParams<{ normalizedName: string }>();

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

  const categories = catData?.getCategories?.categories ?? [];
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
      setFilters((prev) => ({
        ...prev,
        categoryIds,
        startingDate: startingDate
          ? new Date(startingDate).toISOString()
          : undefined,
        endingDate: endingDate ? new Date(endingDate).toISOString() : undefined,
      }));
      startTransition(() => setPaging((p) => ({ ...p, page: 1 })));
    },
    []
  );

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
                setItemsOnPage={(n) => setPaging((p) => ({ ...p, onPage: n }))}
                pageIndex={paging.page}
                setPageIndex={(n) => setPaging((p) => ({ ...p, page: n }))}
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
