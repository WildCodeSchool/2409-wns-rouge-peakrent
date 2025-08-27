"use client";

import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { orderItemStatusOptions } from "@/components/forms/formField/select/options/orderItemOptions";
import { getOrderItemStatusVariant } from "@/utils/getVariants/getOrderItemStatusVariant";
import { toast } from "sonner";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const firstName = row.getValue("name") as string;
  const size = row.getValue("size") as string;
  const searchText = filterValue.toLowerCase();

  return (
    firstName?.toLowerCase().includes(searchText) ||
    size?.toLowerCase().includes(searchText)
  );
};

export const createColumns = (
  onUpdateStatus: (
    id: string | number,
    newStatus: string | null
  ) => Promise<void>
): ColumnDef<any>[] => [
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

  column.CreateSelectInputColumn({
    id: "status",
    accessorKey: "status",
    title: "statut",
    setValue: async (newValue, oldValue, id) => {
      let formattedValue: string | null = newValue as string | null;
      if (newValue === "null" || newValue === null || newValue === "") {
        formattedValue = oldValue as string | null;
      }
      try {
        await onUpdateStatus(id, formattedValue);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    options: orderItemStatusOptions,
    getVariantFunction: getOrderItemStatusVariant,
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    autoOpen: true,
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
    accessorKey2: "variant.pricePerDay",
    headerClassName: "mx-auto",
    badgeVariant: "orange",
    badgeVariant2: "blue",
    enableSorting: true,
    enableHiding: false,
    customPrice2: (datas) => datas.variant.pricePerDay / 100,
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
];
