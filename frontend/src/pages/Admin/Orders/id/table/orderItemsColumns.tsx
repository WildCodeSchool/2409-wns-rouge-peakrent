"use client";

import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import {
  getOrderItemStatusText,
  getOrderItemStatusVariant,
} from "@/utils/getVariants/getOrderItemStatusVariant";
import { DataTableRowOrderByIdActions } from "./OrderByIdActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const firstName = row.getValue("name") as string;
  const size = row.getValue("size") as string;
  const searchText = filterValue.toLowerCase();

  return (
    firstName?.toLowerCase().includes(searchText) ||
    size?.toLowerCase().includes(searchText)
  );
};

export const createColumns = (): ColumnDef<any>[] => [
  // column.createSelectColumn(),

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
    accessorKey: "variant.product.urlImage",
    altAccessorKey: "variant.product.name",
    size: 60,
  }),

  column.createNameAndSkuColumn({
    id: "name",
    title: "nom / SKU",
    accessorKey: "variant.product.name",
    skuAccessorKey: "variant.product.sku",
    withCopy: true,
    enableHiding: true,
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createBadgeColumn({
    id: "status",
    accessorKey: "status",
    title: "statut",
    variantFn: (row) => getOrderItemStatusVariant(row.original.status),
    labelFn: (row) => getOrderItemStatusText(row.original.status),
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "size",
    accessorKey: "variant.size",
    title: "taille",
    headerClassName: "max-w-[35px]",
    className: "max-w-[35px] font-medium",
    enableSorting: true,
  }),

  column.createTwoPriceWithBadgeColumn({
    id: "price",
    title: "price",
    accessorKey: "totalPrice",
    accessorKey2: "variant.pricePerHour",
    headerClassName: "mx-auto",
    badgeVariant: "orange",
    badgeVariant2: "blue",
    enableSorting: true,
    enableHiding: false,
    customPrice2: (datas) => datas.variant.pricePerHour / 100,
  }),

  column.createStringColumn({
    id: "quantity",
    accessorKey: "quantity",
    title: "quantité",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createTwoDateColumn({
    id: "dates",
    title: "dates",
    accessorKey: "startsAt",
    secondAccessorKey: "endsAt",
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
