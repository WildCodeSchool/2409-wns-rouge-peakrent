import { useStoreStore } from "@/stores/admin/store.store";
import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_STORES } from "@/GraphQL/stores";
import { ColumnConfig } from "@/types/datasTable";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";
import { createColumns } from "./storesColumns";

export default function StoresTable() {
  const storesStore = useStoreStore((state) => state.stores);
  const storesFetched = useStoreStore((state) => state.storesFetched);
  const setStores = useStoreStore((state) => state.setStores);
  const setStoresFetched = useStoreStore((state) => state.setStoresFetched);

  const { data, error, loading } = useQuery(GET_STORES);

  const columnConfigs: ColumnConfig[] = [];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des magasins");
      console.error("Erreur lors de la récupération des magasins:", error);
      return;
    }

    if (data?.getStores) {
      setStores(data.getStores);
      setStoresFetched(true);
    }
  }, [data, error, setStores, setStoresFetched]);

  if (loading || !storesFetched) {
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
      data={storesStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: `Nom / Référence / "id"`,
      }}
      hideColumns={{
        reference: false,
      }}
      rowLink="id"
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
