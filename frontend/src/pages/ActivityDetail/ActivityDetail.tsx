import FilterButton from "@/components/buttons/FilterButton";
import { ActivityCard } from "@/components/cards/ActivityCard";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import type { Category as CategoryType } from "@/gql/graphql";
import { GET_ACTIVITY_BY_NORMALIZED_NAME } from "@/graphQL/activities";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { useProductFilters } from "@/hooks/useProductFilters";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const ActivityDetail = () => {
  const { normalizedName } = useParams<{ normalizedName: string }>();

  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
  } = useQuery(gql(GET_ACTIVITY_BY_NORMALIZED_NAME), {
    variables: { normalizedName },
    skip: !normalizedName?.trim(),
  });
  const activity = activityData?.getActivityByNormalizedName;

  const {
    data: catData,
    loading: catLoading,
    error: catError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const categories: CategoryType[] = catData?.getCategories?.categories ?? [];

  // Créer activityIds à partir de l'activité courante
  const activityIds = useMemo(
    () => (activity?.id ? [Number(activity.id)] : undefined),
    [activity?.id]
  );

  const {
    filters,
    categoryIds,
    paging,
    variables,
    applyFilters,
    clearFilters,
    setPage,
    setItemsPerPage,
  } = useProductFilters({ categories, activityIds });

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
    skip: !activityIds?.length,
  });

  const products = prodData?.getPublishedProducts?.products ?? [];
  const maxPage = prodData?.getPublishedProducts?.pagination?.totalPages ?? 0;

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
            selectedCategories={categoryIds}
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
                  selectedCategories={categoryIds}
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
                setItemsOnPage={setItemsPerPage}
                pageIndex={paging.page}
                setPageIndex={setPage}
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
