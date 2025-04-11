import { useEffect, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { GET_MINIMAL_PRODUCTS_WITH_PAGING } from "@/GraphQL/products";
import ProductsList from "@/components/ProductsList/ProductsList";
import FilterButton from "@/components/buttons/FilterButton";
import { GET_CATEGORIES } from "@/GraphQL/categories";
import FilterList from "@/components/FilterList/FilterList";

const ProductsPage = () => {
  const [itemsOnPage, setItemsOnPage] = useState(15);
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  // const [selectedActivities, setSelectedActivities] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const {
    data: initialData,
    loading: initialLoading,
    error: initialError,
  } = useQuery(gql(GET_MINIMAL_PRODUCTS_WITH_PAGING), {
    variables: { onPage: itemsOnPage, page: pageIndex },
  });

  const [
    fetchFilteredProducts,
    { data: filteredData, loading: filterLoading, error: filterError },
  ] = useLazyQuery(gql(GET_MINIMAL_PRODUCTS_WITH_PAGING));

  useEffect(() => {
    if (initialData?.getProducts?.products) {
      setProducts(initialData.getProducts.products);
      setMaxPage(initialData.getProducts.pagination.totalPages);
    }
  }, [initialData]);

  useEffect(() => {
    if (filteredData?.getProducts?.products) {
      setProducts(filteredData.getProducts.products);
      setMaxPage(filteredData.getProducts.pagination.totalPages);
    }
  }, [filteredData]);

  const {
    data: getCategoriesData,
    loading: getCategoriesLoading,
    error: getCategoriesError,
  } = useQuery(gql(GET_CATEGORIES));

  const categories = getCategoriesData?.getCategories || [];

  // const {
  //   data: getActivitiesData,
  //   loading: getActivitiesLoading,
  //   error: getActivitiesError,
  // } = useQuery(gql(GET_ACTIVITIES));

  // const activities = getActivitiesData?.getActivities || [];

  const handleFilter = () => {
    setPageIndex(1);
    fetchFilteredProducts({
      variables: {
        onPage: itemsOnPage,
        page: 1,
        categoriesId: selectedCategories,
        // activitiesId: selectedActivities,
      },
    });
  };

  const modal = {
    description: "Filtre",
    content: (
      <FilterList
        // activities={activities}
        // selectedActivities={selectedActivities}
        // setSelectedActivities={setSelectedActivities}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handleFilter={handleFilter}
      />
    ),
  };

  if (initialError || filterError)
    return <div>Erreur lors du chargement des produits.</div>;
  if (getCategoriesError)
    return <div>Erreur lors du chargement des catégories.</div>;
  // if (getActivitiesError)
  //   return <div>Erreur lors du chargement des catégories.</div>;

  if (
    initialLoading ||
    getCategoriesLoading ||
    // getActivitiesLoading ||
    filterLoading
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadIcon size={40} />
      </div>
    );
  }
  return (
    maxPage > 0 && (
      <>
        <div className="flex flex-row items-center justify-between h-10 px-2.5">
          <h2>Breadcrumb ?</h2>
          <FilterButton
            text={"Filtrer"}
            modalContent={modal.content}
            ariaLabel={"editCategoryAriaLabel"}
            variant="primary"
            modalTitle="Filtrer les produits"
            modalDescription={modal.description}
            className="flex md:hidden text-base"
          />
        </div>

        <div className="flex">
          <aside className="hidden md:block w-[250px] bg-gray-100 p-4">
            <FilterList
              // activities={activities}
              // selectedActivities={selectedActivities}
              // setSelectedActivities={setSelectedActivities}
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              handleFilter={handleFilter}
            />
          </aside>
          <div className="flex-1 p-4">
            <ProductsList
              title="Tous les produits"
              items={products}
              itemsOnPage={itemsOnPage}
              setItemsOnPage={setItemsOnPage}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              maxPage={maxPage}
            />
          </div>
        </div>
      </>
    )
  );
};

export default ProductsPage;
