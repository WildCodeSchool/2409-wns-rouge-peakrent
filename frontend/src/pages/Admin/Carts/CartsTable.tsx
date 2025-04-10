import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_CARTS } from "@/GraphQL/carts";
import { useCartStore } from "@/stores/admin/cart.store";
import { ColumnConfig, SelectFunction } from "@/types/datasTable";
import { gql, useQuery } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createColumns } from "./storesColumns";

export function CartsTable() {
  const cartsStore = useCartStore((state) => state.carts);
  const cartsFetched = useCartStore((state) => state.cartsFetched);
  const setCarts = useCartStore((state) => state.setCarts);
  const setCartsFetched = useCartStore((state) => state.setCartsFetched);

  const { data, error, loading } = useQuery(gql(GET_CARTS));

  const columnConfigs: ColumnConfig[] = [];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des paniers");
      console.error("Erreur lors de la récupération des paniers:", error);
      return;
    }

    if (data?.getCarts) {
      setCarts(data.getCarts);
      setCartsFetched(true);
    }
  }, [data, error, setCarts, setCartsFetched]);

  if (loading || !cartsFetched) {
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

  const multipleSelectFunctions: SelectFunction[] = [
    {
      text: "Vider le(s) panier(s)",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "orange",
      onTrigger(selectedRows) {
        console.log(selectedRows);
        return true;
      },
    },
  ];
  return (
    <Table
      data={cartsStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: `Nom / Référence / "id"`,
      }}
      hideColumns={{
        firstname: false,
        lastname: false,
      }}
      rowLink="id"
      hideExport
      multipleSelectFunctions={multipleSelectFunctions}
    />
  );
}
