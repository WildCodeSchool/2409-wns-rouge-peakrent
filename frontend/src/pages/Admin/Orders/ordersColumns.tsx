import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableRowOrdersActions } from "./OrderActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return '"' + id?.toLowerCase() + '"' === searchText;
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

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowOrdersActions row={row} />,
  },
];
