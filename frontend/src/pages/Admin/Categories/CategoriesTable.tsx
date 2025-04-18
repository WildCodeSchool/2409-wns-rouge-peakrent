import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import {
  DELETE_MULTIPLE_CATEGORIES,
  GET_CATEGORIES,
} from "@/GraphQL/categories";
import {
  deleteMultipleCategories,
  useCategoryStore,
} from "@/stores/admin/category.store";
import { ColumnConfig } from "@/types/datasTable";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  const [deleteCategories] = useMutation(gql(DELETE_MULTIPLE_CATEGORIES));

  const { data, error, loading } = useQuery(gql(GET_CATEGORIES), {
    variables: {
      input: {
        page: 1,
        onPage: 1000,
        sort: "id",
        order: "ASC",
        onlyParent: true,
      },
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
    try {
      const { data } = await deleteCategories({ variables: { ids } });
      const idsToRemove = data?.deleteCategories?.map((id: string | number) =>
        Number(id)
      );
      if (
        data?.deleteCategories &&
        data.deleteCategories.length === ids.length
      ) {
        toast.success(
          "Toutes les catégories séléctionnées ont été supprimées avec succès"
        );
        deleteMultipleCategories(idsToRemove);
        return true;
      } else if (data?.deleteCategories && data.deleteCategories.length > 0) {
        toast.success(
          `${data.deleteCategories.length} catégorie(s) ont été supprimée(s) avec succès`
        );
        deleteMultipleCategories(idsToRemove);
        return true;
      }
      toast.error("Erreur lors de la suppression des catégories séléctionnées");
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression des catégories séléctionnées");
      return false;
    }
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
