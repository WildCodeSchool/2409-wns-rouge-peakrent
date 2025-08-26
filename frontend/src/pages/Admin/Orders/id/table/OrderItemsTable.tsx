"use client";

import { DataTable, DataTableSkeleton } from "@/components/ui";
import { Order as OrderType } from "@/gql/graphql";
import { UPDATE_ORDER_ITEM_ADMIN } from "@/graphQL";
import { useOrderStore } from "@/stores/admin/order.store";
import { getTotalOrderPrice } from "@/utils/getTotalOrderPrice";
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { createColumns } from "./orderItemsColumns";

export default function OrderItemsTable({ order }: { order?: OrderType }) {
  const orderItems = order?.orderItems || [];
  const [updateStatus] = useMutation(gql(UPDATE_ORDER_ITEM_ADMIN), {
    onCompleted: () => {
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    useOrderStore.setState({ currentOrder: order });
    useOrderStore.setState({ currentOrderFetched: true });
  }, [order]);

  const onUpdateStatus = async (
    id: string | number,
    newStatus: string | null
  ) => {
    await updateStatus({
      variables: {
        id,
        data: {
          status: newStatus,
        },
      },
    });
  };

  if (!order) {
    return (
      <DataTableSkeleton
        columns={createColumns(async () => {})}
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
      columns={createColumns(onUpdateStatus)}
      filterTextOptions={{
        id: "name",
        placeholder: "nom / SKU / taille" + " ...",
      }}
      hideColumns={{}}
    />
  );
}
