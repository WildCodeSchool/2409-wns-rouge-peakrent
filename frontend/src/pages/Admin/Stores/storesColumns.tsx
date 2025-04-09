import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { DataTableRowStoresActions } from "./StoreActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const reference = String(row.getValue("reference"));
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    name?.toLowerCase().includes(searchText) ||
    reference?.toLowerCase().includes(searchText) ||
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
  }),

  column.createStringColumn({
    id: "reference",
    accessorKey: "reference",
    title: "Référence",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    title: "Téléphone",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "address",
    accessorKey: "address1",
    title: "Adresse",
    className: "max-w-[200px] line-clamp-2",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "city",
    accessorKey: "city",
    title: "Ville",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "country",
    accessorKey: "country",
    title: "Pays",
    enableSorting: true,
    enableHiding: true,
  }),

  {
    id: "variants",
    accessorKey: "storeVariants",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Variants"
        className="max-w-[75px]"
      />
    ),
    cell: ({ row }) => {
      const nbVariants = row.original.storeVariants.length;
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

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowStoresActions row={row} />,
  },
];
