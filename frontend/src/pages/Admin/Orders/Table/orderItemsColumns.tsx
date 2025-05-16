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
    accessorKey: "url_image",
    altAccessorKey: "size",
    size: 50,
  }),

  column.createNameAndSkuColumn({
    id: "name",
    title: "Nom",
    accessorKey: "name",
    skuAccessorKey: "exact_sku",
    className: "max-w-[120px] md:max-w-[200px] lg:max-w-[250px]",
    enableHiding: true,
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "size",
    accessorKey: "size",
    title: "Taille",
    headerClassName: "max-w-[35px]",
    className: "max-w-[35px] font-medium",
    enableSorting: true,
  }),

  column.createDateColumn({
    id: "minDate",
    title: "Date de début",
    accessorKey: "estimate_date_range.from",
    divClassName: "mx-auto max-w-[60px]",
    headerClassName: "mx-auto max-w-[60px]",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createDateColumn({
    id: "maxDate",
    title: "Date de fin",
    accessorKey: "estimate_date_range.to",
    divClassName: "mx-auto max-w-[60px]",
    headerClassName: "mx-auto max-w-[60px]",
    enableSorting: true,
    enableHiding: true,
  }),

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowOrderByIdActions row={row} />,
  },
];
