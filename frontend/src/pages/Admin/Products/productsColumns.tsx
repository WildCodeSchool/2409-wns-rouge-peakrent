import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { DataTableRowProductsActions } from "./ProductActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const sku = String(row.getValue("sku"));
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    name?.toLowerCase().includes(searchText) ||
    sku?.toLowerCase().includes(searchText) ||
    '"' + id?.toLowerCase() + '"' === searchText
  );
};

export const createColumns: ColumnDef<any>[] = [
  {
    id: "active",
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title=""
        className=""
        aria-hidden="true"
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const active = datas.isPublished;
      return (
        <div
          role="presentation"
          aria-hidden="true"
          className="flex w-4 items-center overflow-hidden p-0"
        >
          {active ? (
            <span className="block h-[75px] w-4 bg-green-500"></span>
          ) : (
            <span className="block h-[75px] w-4 bg-red-500"></span>
          )}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  column.createSelectColumn(),

  column.createStringColumn({
    id: "id",
    accessorKey: "id",
    title: "#",
    className: "text-start",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createHiddenColumn({
    id: "sku",
    accessorKey: "sku",
    title: "SKU",
  }),

  column.createImageColumn({
    id: "image",
    title: "image",
    accessorKey: "urlImage",
    altAccessorKey: "name",
    imageClassName: "size-[60px]",
    size: 50,
    enableHiding: true,
  }),

  column.createNameAndSkuColumn({
    id: "name",
    accessorKey: "name",
    skuAccessorKey: "sku",
    title: "Nom / SKU",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "description",
    accessorKey: "description",
    headerClassName: "max-w-[200px] mx-0",
    title: "Description",
    className: "max-w-[200px] line-clamp-3",
    enableHiding: true,
  }),

  column.createStringTableColumn({
    id: "categories",
    accessorKey: "categories",
    valueKey: "name",
    title: "categories",
    headerClassName: "max-w-[75px]",
    className: "rounded-full px-2",
    enableHiding: true,
    enableSorting: false,
  }),

  {
    id: "variants",
    accessorKey: "variants",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Variants"
        className="max-w-[75px]"
      />
    ),
    cell: ({ row }) => {
      const nbVariants = row.original.variants.length;
      return (
        <div className="flex items-center justify-center">{nbVariants}</div>
      );
    },
    enableHiding: true,
    filterFn: (row, id, value) => {
      const cellValue = row.getValue(id);
      if (value?.toString() !== "null") {
        return Array.isArray(cellValue) && cellValue.length > 0;
      } else if (value?.toString() === "null") {
        return Array.isArray(cellValue) && cellValue.length === 0;
      }
      return true;
    },
  },

  column.createDateColumn({
    id: "createdAt",
    accessorKey: "createdAt",
    title: "Crée le",
    enableSorting: true,
    enableHiding: true,
    showTime: true,
  }),

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowProductsActions row={row} />,
  },
];
