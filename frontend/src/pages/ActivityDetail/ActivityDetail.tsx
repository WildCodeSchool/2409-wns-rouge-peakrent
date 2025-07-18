import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import { ActivityCard } from "@/components/cards/ActivityCard";
import {
  Activity as ActivityType,
  Category as CategoryType,
  Product as ProductType,
} from "@/gql/graphql";
import { GET_ACTIVITY_BY_NORMALIZED_NAME } from "@/graphQL/activities";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_MINIMAL_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ActivityDetail = () => {
  const { normalizedName } = useParams<{ normalizedName: string }>();

  // États pour la pagination et les filtres
  const [itemsOnPage, setItemsOnPage] = useState(15);
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStartingDate, setSelectedStartingDate] = useState<
    string | undefined
  >("");
  const [selectedEndingDate, setSelectedEndingDate] = useState<
    string | undefined
  >("");
  const [products, setProducts] = useState<ProductType[]>([]);

  // Récupération de l'activité
  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
  } = useQuery(gql(GET_ACTIVITY_BY_NORMALIZED_NAME), {
    variables: { normalizedName },
    skip: !normalizedName,
  });

  // Récupération des catégories pour les filtres
  const {
    data: getCategoriesData,
    loading: getCategoriesLoading,
    error: getCategoriesError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  // Requête pour les produits filtrés
  const [
    fetchFilteredProducts,
    { data: filteredData, loading: filterLoading, error: filterError },
  ] = useLazyQuery(gql(GET_MINIMAL_PRODUCTS_WITH_PAGING));

  // Initialisation des produits de l'activité
  useEffect(() => {
    if (activityData?.getActivityByNormalizedName?.products) {
      setProducts(activityData.getActivityByNormalizedName.products);
      setMaxPage(1); // Une seule page pour les produits de l'activité
    }
  }, [activityData]);

  // Mise à jour des produits filtrés
  useEffect(() => {
    if (filteredData?.getProducts?.products) {
      setProducts(filteredData.getProducts.products);
      setMaxPage(filteredData.getProducts.pagination.totalPages);
    }
  }, [filteredData]);

  // Mise à jour des catégories
  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
  }, [getCategoriesData?.getCategories.categories]);

  // Fonction de filtrage
  const handleFilter = () => {
    setPageIndex(1);
    if (
      selectedStartingDate &&
      selectedEndingDate &&
      new Date(selectedStartingDate) > new Date(selectedEndingDate)
    ) {
      return toast.error(
        "La date de fin ne peut pas être inférieure à celle de début"
      );
    }
    fetchFilteredProducts({
      variables: {
        onPage: itemsOnPage,
        page: 1,
        categoryIds: selectedCategories,
        activityIds: activityData?.getActivityByNormalizedName?.id
          ? [parseInt(activityData.getActivityByNormalizedName.id)]
          : undefined,
        startingDate: selectedStartingDate
          ? new Date(selectedStartingDate).toISOString()
          : undefined,
        endingDate: selectedEndingDate
          ? new Date(selectedEndingDate).toISOString()
          : undefined,
      },
    });
  };

  // Configuration du modal de filtres
  const modal = {
    description: "Filtre",
    content: (
      <FilterList
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handleFilter={handleFilter}
        selectedEndingDate={selectedEndingDate}
        selectedStartingDate={selectedStartingDate}
        setSelectedEndingDate={setSelectedEndingDate}
        setSelectedStartingDate={setSelectedStartingDate}
      />
    ),
  };

  // Gestion des erreurs
  if (activityError)
    return <div>Erreur lors du chargement de l&apos;activité.</div>;
  if (getCategoriesError)
    return <div>Erreur lors du chargement des catégories.</div>;
  if (filterError) return <div>Erreur lors du filtrage des produits.</div>;

  // Gestion du chargement
  if (activityLoading || getCategoriesLoading || filterLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadIcon size={40} />
      </div>
    );
  }

  const activity = activityData?.getActivityByNormalizedName;

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
      {/* Header avec breadcrumb */}
      <div className="px-4 md:px-8 py-4 border-b">
        <h1 className="text-xl md:text-2xl font-bold">
          Activités / {activity.name}
        </h1>
      </div>

      {/* Section des produits associés avec sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* Filtres sur desktop */}
        <aside className="hidden md:block w-[280px] bg-gray-50 border-r p-6">
          <FilterList
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            handleFilter={handleFilter}
            selectedEndingDate={selectedEndingDate}
            selectedStartingDate={selectedStartingDate}
            setSelectedEndingDate={setSelectedEndingDate}
            setSelectedStartingDate={setSelectedStartingDate}
          />
        </aside>

        {/* Liste des produits */}
        <div className="flex-1">
          <div className="">
            <ActivityCard activity={activity} showButton={false} className="rounded-t-none mb-4" />
          </div>
          {/* Bouton filtre mobile */}
          <div className="md:hidden mb-4 px-4 md:px-8">
            <FilterButton
              text={"Filtrer"}
              modalContent={modal.content}
              ariaLabel={"filterProductsAriaLabel"}
              variant="primary"
              modalTitle="Filtrer les produits"
              modalDescription={modal.description}
              className="w-full text-base"
            />
          </div>

          <div className="px-4 md:px-8 pb-8">
            {products.length > 0 ? (
              <ProductsList
                title="Produits associés"
                items={products}
                itemsOnPage={itemsOnPage}
                setItemsOnPage={setItemsOnPage}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
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
