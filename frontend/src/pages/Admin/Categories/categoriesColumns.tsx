import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
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

  column.createStringColumn({
    id: "name",
    accessorKey: "name",
    title: "Nom",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createStringColumn({
    id: "normalizedName",
    accessorKey: "normalizedName",
    title: "Nom normalisé",
    enableSorting: true,
    enableHiding: true,
    filterFn: multiColumnFilter,
  }),

  column.createBadgeColumn({
    id: "variant",
    accessorKey: "variant",
    title: "Variant",
    className: "w-[120px]",
    variantFn: (row) => row.original.variant,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: true,
  }),

  {
    id: "subCategories",
    accessorKey: "childrens",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sous catégories"
        className="max-w-[75px]"
      />
    ),
    cell: ({ row }) => {
      const nbSubCategories = row.original.childrens.length;
      return (
        <div className="flex items-center justify-center">
          {nbSubCategories}
        </div>
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

  column.createDateColumn({
    id: "updatedAt",
    accessorKey: "updatedAt",
    title: "Modifié le",
    enableSorting: true,
    enableHiding: true,
    showTime: true,
  }),

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowCategoriesActions row={row} />,
  },
];
