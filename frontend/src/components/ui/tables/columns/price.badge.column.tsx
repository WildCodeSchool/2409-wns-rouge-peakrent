import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface PriceBadgeColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  comparisonKey: string; // Key to compare against for badge color
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  devise?: string; // Optional devise symbol, defaults to "€"
}

/**
 * Creates a price badge column for a table.
 *
 * @param {Object} params - The parameters to configure the price badge column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the price value.
 * @param {string} params.comparisonKey - Key to compare the price against for badge color.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.devise="€"] - Devise symbol to display.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const priceBadgeColumn = createPriceBadgeColumn({
 *   id: "price",
 *   title: "Price",
 *   accessorKey: "price",
 *   comparisonKey: "best_price",
 *   className: "text-md",
 *   headerClassName: "max-w-[75px]",
 *   enableSorting: true,
 *   devise: "$", // Optional, defaults to "€"
 * });
 */
export function createPriceWithBadgeColumn({
  id,
  title,
  accessorKey,
  comparisonKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  devise = "€",
}: PriceBadgeColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[90px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      const price = getNestedValueFunction(datas, accessorKey);
      const comparisonPrice = getNestedValueFunction(datas, comparisonKey);

      return (
        <div className="flex items-center justify-center">
          <Badge
            variant={price <= comparisonPrice ? "green" : "red"}
            className={cn("text-md w-[90px] rounded-lg px-1", className)}
          >
            {price.toFixed(2) ?? "-- "}
            {` ${devise}`}
          </Badge>
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
