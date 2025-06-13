import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_ORDERS_ADMIN } from "@/GraphQL/order";
import { useOrderStore } from "@/stores/admin/order.store";
import { ColumnConfig } from "@/types/datasTable";
import { gql, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { createColumns } from "./ordersColumns";

export default function OrdersTable() {
  const ordersStore = useOrderStore((state) => state.orders);
  const ordersFetched = useOrderStore((state) => state.ordersFetched);
  const setOrders = useOrderStore((state) => state.setOrders);
  const setOrdersFetched = useOrderStore((state) => state.setOrdersFetched);

  const { data, error, loading } = useQuery(gql(GET_ORDERS_ADMIN));

  const columnConfigs: ColumnConfig[] = [];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des produits");
      console.error("Erreur lors de la récupération des produits:", error);
      return;
    }

    if (data?.getOrdersAdmin && !ordersFetched) {
      setOrders(data.getOrdersAdmin);
      setOrdersFetched(true);
    }
  }, [data, error, setOrders, setOrdersFetched]);

  if (loading || !ordersFetched) {
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
      data={ordersStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "id",
        placeholder: `"id"`,
      }}
      hideColumns={{
        sku: false,
      }}
      rowLink="id"
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
