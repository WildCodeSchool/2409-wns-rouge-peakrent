"use client";

import { OrderItem as OrderItemType } from "@/gql/graphql";
import { Row } from "@tanstack/react-table";

interface DataTableRowOrderByIdActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowOrderByIdActions<TData>({
  row,
}: DataTableRowOrderByIdActionsProps<TData>) {
  const orderItem = row.original as OrderItemType;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2"></div>
  );
}
