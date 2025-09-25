import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import {
  genericBooleanNullFilter,
  genericStringFilter,
} from "@/components/ui/tables/columns/utils/filters";
import {
  getOrderStatusText,
  getOrderStatusVariant,
  getPaymentStatusText,
  getPaymentStatusVariant,
} from "@/utils";
import { DataTableRowOrdersActions } from "./OrderActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const id = String(row.getValue("id"));
  const reference = String(row.getValue("reference"));
  const searchText = filterValue.toLowerCase();

  return (
    '"' + id?.toLowerCase() + '"' === searchText ||
    reference?.toLowerCase().includes(searchText)
  );
};

export const createColumns: ColumnDef<any>[] = [
  column.createStringColumn({
    id: "id",
    accessorKey: "id",
    title: "#",
    className: "text-start",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createBadgeColumn({
    id: "status",
    accessorKey: "status",
    title: "Statut",
    enableSorting: true,
    labelFn: (row) => getOrderStatusText(row.original.status),
    variantFn: (row) => getOrderStatusVariant(row.original.status),
    filterFn: genericStringFilter(),
  }),

  column.createStringColumn({
    id: "reference",
    accessorKey: "reference",
    title: "Référence",
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createPriceWithBadgeColumn({
    id: "price",
    accessorKey: "totalPriceWithVoucher",
    title: "Prix Total",
    enableSorting: true,
    devise: "€",
    variantFn: (row) => "green",
  }),

  column.createBadgeColumn({
    id: "paymentStatus",
    accessorKey: "paidAt",
    title: "Paiement",
    enableSorting: true,
    labelFn: (row) => getPaymentStatusText(!!row.original.paidAt),
    variantFn: (row) => getPaymentStatusVariant(!!row.original.paidAt),
    filterFn: genericBooleanNullFilter(),
  }),

  column.createTwoDateColumn({
    id: "dates",
    accessorKey: "startsAt",
    secondAccessorKey: "endsAt",
    title: "Début / Fin",
    enableSorting: true,
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
    cell: ({ row }) => <DataTableRowOrdersActions row={row} />,
  },
];
