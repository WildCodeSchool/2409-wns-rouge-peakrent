import React from "react";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";

import SingleSelect from "../components/SingleSelect";

interface StringColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    renderLabel?: () => React.ReactNode;
  }[];
  setValue?: (value: string, id: string | number) => void;
  getVariantFunction?: (
    value: string
  ) => VariantProps<typeof badgeVariants>["variant"];
  typeofValue?: "string" | "number" | "boolean";
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  textClassName?: string;
}

export function CreateSelectInputColumn({
  id,
  title,
  accessorKey,
  options,
  className,
  setValue,
  getVariantFunction = () => "default",
  typeofValue = "string",
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  textClassName,
}: StringColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[180px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      return (
        <SingleSelect
          row={row}
          typeofValue={typeofValue}
          accessorKey={accessorKey}
          options={options}
          setValue={setValue}
          getVariantFunction={getVariantFunction}
          className={className}
          textClassName={textClassName}
        />
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
