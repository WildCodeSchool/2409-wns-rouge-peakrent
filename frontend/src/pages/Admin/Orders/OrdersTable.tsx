import { useEffect } from "react";

import { DataTable } from "@/components/ui";
import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import { GET_ORDERS_ADMIN } from "@/graphQL/order";
import { useOrderStore } from "@/stores/admin/order.store";
import { ColumnConfig } from "@/types/datasTable";
import {
  getOrderStatusOptionsLabels,
  getPaymentStatusOptionsLabels,
} from "@/utils";
import { getOrdersWithDatesAndTotalPrice } from "@/utils/getOrdersWithDates";
import { gql, useQuery } from "@apollo/client";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { createColumns } from "./ordersColumns";

export default function OrdersTable() {
  // Store states
  const ordersStore = useOrderStore((state) => state.orders);
  const ordersFetched = useOrderStore((state) => state.ordersFetched);
  const setOrders = useOrderStore((state) => state.setOrders);
  const setOrdersFetched = useOrderStore((state) => state.setOrdersFetched);

  // GraphQL query
  const { data, error, loading } = useQuery(gql(GET_ORDERS_ADMIN));

  // Column configs
  const columnConfigs: ColumnConfig[] = [
    {
      id: "status",
      title: "statut",
      options: getOrderStatusOptionsLabels(),
      Icon: Filter as unknown as React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >,
    },
    {
      id: "paymentStatus",
      title: "paiement",
      options: getPaymentStatusOptionsLabels(),
      Icon: Filter as unknown as React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >,
    },
  ];

  // Effect to fetch orders
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

  // Skeleton loading
  if (loading || !ordersFetched) {
    return (
      <DataTableSkeleton
        columns={createColumns}
        searchableColumnCount={1}
        filterableColumnCount={3}
        rowCount={6}
        cellHeights={85}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  // Format orders with dates
  const ordersWithDatesAndTotalPrice =
    getOrdersWithDatesAndTotalPrice(ordersStore);

  return (
    <DataTable
      data={ordersWithDatesAndTotalPrice}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "reference",
        placeholder: `Référence / "id"`,
      }}
      hideColumns={{
        sku: false,
      }}
      rowLink="id"
      hideExport
    />
  );
}
