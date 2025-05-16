import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableRowOrderByIdActions } from "./orderItemActions";

// import { DataTableRowOrderByIdActions } from "./NewOrderByIdActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const firstName = row.getValue("name") as string;
  const searchText = filterValue.toLowerCase();

  return firstName?.toLowerCase().includes(searchText);
};

export const createColumns = (): ColumnDef<any>[] => [
  column.createSelectColumn(),

  column.createImageColumn({
    id: "Image",
    title: "Image",
    accessorKey: "variant.product.urlImage",
    altAccessorKey: "variant.product.name",
    size: 50,
  }),

  column.createNameAndSkuColumn({
    id: "name",
    title: "Nom",
    accessorKey: "variant.product.name",
    skuAccessorKey: "variant.product.sku",
    className: "max-w-[120px] md:max-w-[200px] lg:max-w-[250px]",
    enableHiding: true,
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "size",
    accessorKey: "variant.size",
    title: "Taille",
    headerClassName: "max-w-[35px]",
    className: "max-w-[35px] font-medium",
    enableSorting: true,
  }),

  column.createTwoDateColumn({
    id: "dates",
    title: "Dates",
    accessorKey: "startsAt",
    secondAccessorKey: "endsAt",
    divClassName: "mx-auto max-w-[60px]",
    headerClassName: "mx-auto max-w-[60px]",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "quantity",
    accessorKey: "quantity",
    title: "Quantité",
    enableSorting: true,
  }),

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowOrderByIdActions row={row} />,
  },
];
