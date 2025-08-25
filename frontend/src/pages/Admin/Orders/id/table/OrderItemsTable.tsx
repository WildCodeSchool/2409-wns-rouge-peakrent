"use client";

import { DataTable, DataTableSkeleton } from "@/components/ui";
import { Order as OrderType } from "@/gql/graphql";
import { useOrderStore } from "@/stores/admin/order.store";
import { getTotalOrderPrice } from "@/utils/getTotalOrderPrice";
import { useEffect } from "react";
import { createColumns } from "./orderItemsColumns";

export default function OrderItemsTable({ order }: { order?: OrderType }) {
  const orderItems = order?.orderItems || [];

  useEffect(() => {
    useOrderStore.setState({ currentOrder: order });
    useOrderStore.setState({ currentOrderFetched: true });
  }, [order]);

  if (!order) {
    return (
      <DataTableSkeleton
        columns={createColumns()}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={5}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  const orderItemsWithTotalPrice = orderItems.map((item) => ({
    ...item,
    totalPrice: Number(getTotalOrderPrice([item])),
  }));

  return (
    <DataTable
      data={orderItemsWithTotalPrice}
      columns={createColumns()}
      filterTextOptions={{
        id: "name",
        placeholder: "name" + "/" + "size" + " ...",
      }}
      hideColumns={{}}
    />
  );
}
