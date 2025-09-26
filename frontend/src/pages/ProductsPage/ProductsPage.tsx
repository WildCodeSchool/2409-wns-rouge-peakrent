import FilterButton from "@/components/buttons/FilterButton";
import FilterList from "@/components/filterList/FilterList";
import { LoadIcon } from "@/components/icons/LoadIcon";
import ProductsList from "@/components/productsList/ProductsList";
import {
  Category as CategoryType,
  Product as ProductType,
} from "@/gql/graphql";
import { GET_CATEGORIES } from "@/graphQL/categories";
import { GET_PUBLISHED_PRODUCTS_WITH_PAGING } from "@/graphQL/products";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AppliedFilters = {
  categoryIds?: number[];
  startingDate?: string;
  endingDate?: string;
};

const ProductsPage = () => {
  const [itemsOnPage, setItemsOnPage] = useState(15);
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPage, setMaxPage] = useState<number>(0);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStartingDate, setSelectedStartingDate] = useState<
    string | undefined
  >(undefined);
  const [selectedEndingDate, setSelectedEndingDate] = useState<
    string | undefined
  >(undefined);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [applied, setApplied] = useState<AppliedFilters>({});

  const {
    data: getCategoriesData,
    loading: getCategoriesLoading,
    error: getCategoriesError,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: { data: { page: 1, onPage: 1000, sort: "name", order: "ASC" } },
  });

  const [
    fetchProducts,
    { data, loading: productsLoading, error: productsError },
  ] = useLazyQuery(gql(GET_PUBLISHED_PRODUCTS_WITH_PAGING), {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
  }, [getCategoriesData?.getCategories.categories]);

  useEffect(() => {
    const vars = {
      onPage: itemsOnPage,
      page: pageIndex,
      categoryIds: applied.categoryIds,
      startingDate: applied.startingDate
        ? new Date(applied.startingDate).toISOString()
        : undefined,
      endingDate: applied.endingDate
        ? new Date(applied.endingDate).toISOString()
        : undefined,
    };
    fetchProducts({ variables: vars });
  }, [pageIndex, itemsOnPage, applied, fetchProducts]);

  useEffect(() => {
    if (data?.getPublishedProducts?.products) {
      setProducts(data.getPublishedProducts.products);
      setMaxPage(data.getPublishedProducts.pagination.totalPages);
    }
  }, [data]);

  const applyFilters = ({
    categoryIds,
    startingDate,
    endingDate,
  }: {
    categoryIds: number[];
    startingDate?: string;
    endingDate?: string;
  }) => {
    if (
      startingDate &&
      endingDate &&
      new Date(startingDate) > new Date(endingDate)
    ) {
      return toast.error(
        `La date de fin ne peut pas être inférieure à celle de début`
      );
    }

    setSelectedCategories(categoryIds);
    setSelectedStartingDate(startingDate);
    setSelectedEndingDate(endingDate);

    setApplied({ categoryIds, startingDate, endingDate });
    setPageIndex(1);
  };

  if (getCategoriesError)
    return <div>Erreur lors du chargement des catégories.</div>;
  if (productsError) return <div>Erreur lors du chargement des produits.</div>;

  if (getCategoriesLoading || productsLoading) {
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
          text={"Filtrer"}
          modalContent={() => (
            <FilterList
              categories={categories}
              selectedCategories={selectedCategories}
              selectedEndingDate={selectedEndingDate}
              selectedStartingDate={selectedStartingDate}
              onApply={applyFilters}
            />
          )}
          ariaLabel={"editCategoryAriaLabel"}
          variant="primary"
          modalTitle="Filtrer les produits"
          modalDescription={"Filtrer"}
          className="flex md:hidden text-base w-fit px-3"
        />
      </div>

      <div className="flex">
        {/* Desktop */}
        <aside className="hidden md:block w-[250px] bg-gray-100 p-4">
          <FilterList
            categories={categories}
            selectedCategories={selectedCategories}
            selectedEndingDate={selectedEndingDate}
            selectedStartingDate={selectedStartingDate}
            onApply={applyFilters}
          />
        </aside>

        <div className="flex-1 px-4 pb-4">
          {products.length > 0 ? (
            <ProductsList
              title="Tous les produits"
              items={products}
              itemsOnPage={itemsOnPage}
              setItemsOnPage={setItemsOnPage}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
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
};

export default ProductsPage;
