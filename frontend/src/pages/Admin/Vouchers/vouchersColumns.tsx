import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { DataTableRowVouchersActions } from "./VoucherActions";

const codeOrIdFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const code = String(row.getValue("code") ?? "").toLowerCase();
  const id = String(row.getValue("id") ?? "");
  const search = String(filterValue ?? "").toLowerCase();
  return code.includes(search) || `"${id.toLowerCase()}"` === search;
};

const formatCents = (c: number) =>
  (c / 100).toFixed(2).replace(".", ",") + " €";

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

  {
    id: "amount",
    accessorKey: "amount",
    header: "Montant",
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original;
      return v.type === "percentage" ? `${v.amount}%` : formatCents(v.amount);
    },
  },

  column.createBoolBadgeColumn({
    id: "isActive",
    accessorKey: "isActive",
    title: "Actif",
    className: "w-[120px]",
    enableHiding: true,
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

  // column.createDateColumn({
  //   id: "updatedAt",
  //   accessorKey: "updatedAt",
  //   title: "Modifié le",
  //   enableSorting: true,
  //   enableHiding: true,
  //   showTime: true,
  // }),

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowVouchersActions row={row} />,
  },
];
