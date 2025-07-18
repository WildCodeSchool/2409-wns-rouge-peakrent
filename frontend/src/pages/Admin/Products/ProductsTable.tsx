import { useProductStore } from "@/stores/admin/product.store";
import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_PRODUCTS } from "@/graphQL/products";
import { ColumnConfig } from "@/types/datasTable";
import { gql, useQuery } from "@apollo/client";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { createColumns } from "./productsColumns";

export default function ProductsTable() {
  const productsStore = useProductStore((state) => state.products);
  const productsFetched = useProductStore((state) => state.productsFetched);
  const setProducts = useProductStore((state) => state.setProducts);
  const setProductsFetched = useProductStore(
    (state) => state.setProductsFetched
  );

  const { data, error, loading } = useQuery(gql(GET_PRODUCTS), {
    variables: {
      page: 1,
      onPage: 100,
    },
  });

  const columnConfigs: ColumnConfig[] = [
    {
      id: "active",
      title: "Online",
      options: [
        { value: true as any, label: "Oui" },
        { value: false as any, label: "Non" },
      ],
      Icon: Eye as unknown as React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >,
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des produits");
      console.error("Erreur lors de la récupération des produits:", error);
      return;
    }

    if (data?.getProducts?.products) {
      setProducts(data.getProducts.products);
      setProductsFetched(true);
    }
  }, [data, error, setProducts, setProductsFetched]);

  if (loading || !productsFetched) {
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
      data={productsStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "name",
        placeholder: `Nom / SKU / "id"`,
      }}
      hideColumns={{
        sku: false,
      }}
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
