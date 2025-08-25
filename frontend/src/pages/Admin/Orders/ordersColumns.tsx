import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getOrderStatusText, getOrderStatusVariant } from "@/utils";
import { getTotalOrderPrice } from "@/utils/getTotalOrderPrice";
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
  // column.createSelectColumn(),

  column.createStringColumn({
    id: "id",
    accessorKey: "id",
    title: "#",
    className: "text-start",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createBadgeColumn({
    id: "statut",
    accessorKey: "status",
    title: "Statut",
    enableSorting: true,
    labelFn: (row) => getOrderStatusText(row.original.status),
    variantFn: (row) => getOrderStatusVariant(row.original.status),
  }),

  column.createStringColumn({
    id: "reference",
    accessorKey: "reference",
    title: "Référence",
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createPriceWithBadgeColumn({
    id: "prix",
    accessorKey: "prix",
    title: "Prix",
    enableSorting: true,
    devise: "€",
    variantFn: (row) => "green",
    customPrice: (datas) => Number(getTotalOrderPrice(datas.orderItems)),
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
