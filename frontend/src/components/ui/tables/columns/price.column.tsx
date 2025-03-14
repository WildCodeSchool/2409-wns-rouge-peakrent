import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface PriceColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  devise?: string; // Optional devise symbol, defaults to "€"
  priceFn?: (row: any) => string | number;
}

/**
 * Creates a price column for a table.
 *
 * @param {Object} params - The parameters to configure the price column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the price value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.devise="€"] - devise symbol to display.
 * @param {(raw: any) => number} [params.priceFn] - Custom function to calculate the price.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const bestPriceColumn = createPriceColumn({
 *   id: "bestPrice",
 *   title: "Best",
 *   accessorKey: "best_price",
 *   className: "font-medium",
 *   headerClassName: "max-w-[50px]",
 *   enableSorting: true,
 *   devise: "$", // Optional, defaults to "€"
 * });
 */
export function createPriceColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  devise = "€",
  priceFn,
}: PriceColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("ml-auto max-w-[85px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      const price = getNestedValueFunction(datas, accessorKey);
      return (
        <div
          className={cn(
            "ml-auto flex max-w-[85px] justify-end text-end font-bold",
            className
          )}
        >
          {priceFn ? priceFn(row) : (price?.toFixed(2) ?? "-- ")}
          {` ${devise}`}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
