import type { Category as CategoryType } from "@/gql/graphql";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Filters = {
  categoryNames?: string[];
  startingDate?: string;
  endingDate?: string;
};

interface UseProductFiltersOptions {
  categories: CategoryType[];
  activityIds?: number[]; // Optionnel : pour ActivityDetail uniquement
}

export const useProductFilters = ({
  categories,
  activityIds,
}: UseProductFiltersOptions) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({});
  const [paging, setPaging] = useState({ page: 1, onPage: 15 });

  // Synchroniser avec l'URL
  useEffect(() => {
    const categoryNames =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const startingDate = searchParams.get("startDate") || undefined;
    const endingDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const onPage = parseInt(searchParams.get("onPage") || "15");

    setFilters({
      categoryNames,
      startingDate,
      endingDate,
    });
    setPaging({ page, onPage });
  }, [searchParams]);

  // Convertir categoryNames en categoryIds
  const categoryIds = useMemo(() => {
    if (!filters.categoryNames?.length || !categories.length) {
      return [];
    }
    return filters.categoryNames.flatMap((name) => {
      const id = categories.find((cat) => cat.normalizedName === name)?.id;
      return id !== undefined ? [Number(id)] : [];
    });
  }, [filters.categoryNames, categories]);

  // Variables pour GraphQL
  const variables = useMemo(
    () => ({
      page: paging.page,
      onPage: paging.onPage,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      activityIds: activityIds?.length ? activityIds : undefined,
      startingDate: filters.startingDate
        ? new Date(filters.startingDate).toISOString()
        : undefined,
      endingDate: filters.endingDate
        ? new Date(filters.endingDate).toISOString()
        : undefined,
    }),
    [paging, categoryIds, activityIds, filters.startingDate, filters.endingDate]
  );

  // Mettre à jour l'URL
  const updateURL = useCallback(
    (
      newCategoryIds: number[],
      newFilters: Filters,
      newPaging: typeof paging
    ) => {
      const params = new URLSearchParams();

      if (newCategoryIds.length > 0) {
        const categoryNames = newCategoryIds
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

  // Appliquer les filtres
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

      const categoryNames = categoryIds
        .map(
          (id) =>
            categories.find((cat) => Number(cat.id) === id)?.normalizedName
        )
        .filter(Boolean) as string[];

      const newFilters = {
        categoryNames,
        startingDate,
        endingDate,
      };

      const newPaging = { page: 1, onPage: paging.onPage };

      setFilters(newFilters);
      setPaging(newPaging);
      updateURL(categoryIds, newFilters, newPaging);
    },
    [paging.onPage, updateURL, categories]
  );

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    const newFilters = {};
    const newPaging = { page: 1, onPage: paging.onPage };

    setFilters(newFilters);
    setPaging(newPaging);
    updateURL([], newFilters, newPaging);
  }, [paging.onPage, updateURL]);

  // Changer de page
  const setPage = useCallback(
    (page: number) => {
      const newPaging = { ...paging, page };
      setPaging(newPaging);
      updateURL(categoryIds, filters, newPaging);
    },
    [paging, categoryIds, filters, updateURL]
  );

  // Changer le nombre d'éléments par page
  const setItemsPerPage = useCallback(
    (onPage: number) => {
      const newPaging = { page: 1, onPage };
      setPaging(newPaging);
      updateURL(categoryIds, filters, newPaging);
    },
    [categoryIds, filters, updateURL]
  );

  return {
    // State
    filters,
    categoryIds,
    paging,
    variables,

    // Actions
    applyFilters,
    clearFilters,
    setPage,
    setItemsPerPage,
  };
};
