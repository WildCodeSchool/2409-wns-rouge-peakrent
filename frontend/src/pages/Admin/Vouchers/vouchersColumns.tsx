import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { DataTableRowVouchersActions } from "./VoucherActions";

const codeOrIdFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const code = String(row.getValue("code") ?? "").toLowerCase();
  const id = String(row.getValue("id") ?? "");
  const search = String(filterValue ?? "").toLowerCase();
  return code.includes(search) || `"${id.toLowerCase()}"` === search;
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
    id: "code",
    accessorKey: "code",
    title: "Code",
    enableSorting: true,
    filterFn: codeOrIdFilter,
  }),

  column.createBadgeColumn({
    id: "type",
    accessorKey: "type",
    title: "Type",
    className: "w-[140px]",
    variantFn: (row) =>
      row.original.type === "percentage" ? "blue" : "violet",
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "amount",
    accessorKey: "amount",
    title: "Montant",
    enableSorting: true,
  }),

  column.createBadgeColumn({
    id: "isActive",
    accessorKey: "isActive",
    title: "Actif",
    className: "w-[120px]",
    variantFn: (row) => (row.original.isActive ? "green" : "red"),
    enableHiding: true,
    filterFn: (row, id, value) => {
      const v = row.getValue(id) ? "true" : "false";
      return value.includes(v);
    },
  }),

  column.createDateColumn({
    id: "startsAt",
    accessorKey: "startsAt",
    title: "Début",
    enableSorting: true,
    enableHiding: true,
    showTime: true,
  }),

  column.createDateColumn({
    id: "endsAt",
    accessorKey: "endsAt",
    title: "Fin",
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
    cell: ({ row }) => <DataTableRowVouchersActions row={row} />,
  },
];
