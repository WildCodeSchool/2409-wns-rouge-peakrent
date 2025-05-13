import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import {
  DELETE_MULTIPLE_ACTIVITIES,
  GET_ACTIVITIES,
} from "@/GraphQL/activities";
import {
  deleteMultipleActivities,
  useActivityStore,
} from "@/stores/admin/activity.store";
import { deleteMultipleCategories } from "@/stores/admin/category.store";
import { ColumnConfig } from "@/types/datasTable";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { createColumns } from "./activitiesColumns";

export function ActivitiesTable() {
  const activitiesStore = useActivityStore((state) => state.activities);
  const activitiesFetched = useActivityStore(
    (state) => state.activitiesFetched
  );
  const setActivities = useActivityStore((state) => state.setActivities);
  const setActivitiesFetched = useActivityStore(
    (state) => state.setActivitiesFetched
  );
  const [deleteActivities] = useMutation(gql(DELETE_MULTIPLE_ACTIVITIES));

  const { data, error, loading } = useQuery(gql(GET_ACTIVITIES), {
    variables: {
      data: {
        page: 1,
        onPage: 1000,
        sort: "id",
        order: "ASC",
      },
    },
  });

  const columnConfigs: ColumnConfig[] = [];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des activités");
      console.error("Erreur lors de la récupération des activités:", error);
      return;
    }

    if (data?.getActivities?.activities) {
      setActivities(data.getActivities.activities);
      setActivitiesFetched(true);
    }
  }, [data, error, setActivities, setActivitiesFetched]);

  if (loading || !activitiesFetched) {
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
      const { data } = await deleteActivities({ variables: { ids } });
      const idsToRemove = data?.deleteActivities?.map((id: string | number) =>
        Number(id)
      );
      if (
        data?.deleteActivities &&
        data.deleteActivities.length === ids.length
      ) {
        toast.success(
          "Toutes les activités séléctionnées ont été supprimées avec succès"
        );
        deleteMultipleCategories(idsToRemove);
        return true;
      } else if (data?.deleteActivities && data.deleteActivities.length > 0) {
        toast.success(
          `${data.deleteActivities.length} activité(s) ont été supprimée(s) avec succès`
        );
        deleteMultipleActivities(idsToRemove);
        return true;
      }
      toast.error("Erreur lors de la suppression des activités séléctionnées");
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression des activités séléctionnées");
      return false;
    }
  };

  return (
    <Table
      data={activitiesStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: `Nom / "id"`,
      }}
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
