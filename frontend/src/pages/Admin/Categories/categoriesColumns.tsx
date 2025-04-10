import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableRowCategoriesActions } from "./CategoriesActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    name?.toLowerCase().includes(searchText) ||
    '"' + id?.toLowerCase() + '"' === searchText
  );
};

export const createColumns: ColumnDef<any>[] = [
  column.createSelectColumn(),

  column.createStringColumn({
    id: "id",
    accessorKey: "id",
    title: "#",
    className: "text-start",
    enableSorting: true,
    enableHiding: true,
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

  column.createStringColumn({
    id: "name",
    accessorKey: "name",
    title: "Nom",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

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
    cell: ({ row }) => <DataTableRowCategoriesActions row={row} />,
  },
];
