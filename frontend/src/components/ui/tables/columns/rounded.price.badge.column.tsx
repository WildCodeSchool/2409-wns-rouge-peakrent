import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { Badge, BadgeVariantType } from "@/components/ui/badge";
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
  devise?: string; // Optional devise symbol, defaults to "€",
  badgeVariant?: BadgeVariantType; // Optional badge variant, defaults to "green"
  customPrice?: (data: any) => number | null;
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
 * @param {string} [params.badgeVariant="green"] - Optional variant to display.
 * @param {function} [params.customPrice] - Custom function to get the price.
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
export function createRoundedPriceWithBadgeColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  devise = "€",
  badgeVariant = "green",
  customPrice,
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
      const price = customPrice
        ? customPrice(datas)
        : getNestedValueFunction(datas, accessorKey);
      const formattedPrice = price !== null ? Number(price).toFixed(2) : "--";
      return (
        <div className="flex items-center justify-center">
          <Badge
            variant={badgeVariant}
            className={cn("text-md w-[75px] rounded-lg px-1", className)}
          >
            {formattedPrice}
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
