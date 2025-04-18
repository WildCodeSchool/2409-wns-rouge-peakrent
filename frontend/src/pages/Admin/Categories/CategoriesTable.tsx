import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_CATEGORIES } from "@/GraphQL/categories";
import { useCategoryStore } from "@/stores/admin/category.store";
import { ColumnConfig } from "@/types/datasTable";
import { gql, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { createColumns } from "./categoriesColumns";

export default function CategoriesTable() {
  const categoriesStore = useCategoryStore((state) => state.categories);
  const categoriesFetched = useCategoryStore(
    (state) => state.categoriesFetched
  );
  const setCategories = useCategoryStore((state) => state.setCategories);
  const setCategoriesFetched = useCategoryStore(
    (state) => state.setCategoriesFetched
  );

  const { data, error, loading } = useQuery(gql(GET_CATEGORIES), {
    variables: {
      input: { page: 1, onPage: 1000, sort: "id", order: "ASC" },
    },
  });

  const columnConfigs: ColumnConfig[] = [];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des catégories");
      console.error("Erreur lors de la récupération des catégories:", error);
      return;
    }

    if (data?.getCategories?.categories) {
      setCategories(data.getCategories.categories);
      setCategoriesFetched(true);
    }
  }, [data, error, setCategories, setCategoriesFetched]);

  if (loading || !categoriesFetched) {
    return (
      <DataTableSkeleton
        columns={createColumns}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={6}
        cellHeights={85}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  const onDeleteMultipleFunction = async (ids: string[] | number[]) => {
    return true;
  };

  return (
    <Table
      data={categoriesStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: `Nom / "id"`,
      }}
      rowLink="id"
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
