import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "../utils/getNestedValue";

interface PriceColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  accessorKey2: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  devise?: string;
  devise2?: string;
  hideFirstPrice?: (datas: any) => boolean;
  hideSecondPrice?: (datas: any) => boolean;
  customPrice?: (datas: any) => number | null;
  customPrice2?: (datas: any) => number | null;
  priceThrougth?: boolean;
  price2Througth?: boolean;
}

/**
 * Creates a price column for a table.
 *
 * @param {Object} params - The parameters to configure the price column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the price value.
 * @param {string} params.accessorKey2 - Accessor key to retrieve the second price value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.devise="€"] - devise symbol to display.
 * @param {string} [params.devise2="€"] - devise symbol to display.
 * @param {function} [params.customPrice] - Custom function to get the price.
 * @param {function} [params.customPrice2] - Custom function to get the price.
 * @param {function} [params.hideFirstPrice] - Custom function to hide the first price.
 * @param {function} [params.hideSecondPrice] - Custom function to hide the second price.
 * @param {boolean} [params.priceThrougth=false] - For adding line_through to price Optional, defaults to false.
 * @param {boolean} [params.price2Througth=false] - For adding line_through to price Optional, defaults to false.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const bestPriceColumn = createTwoPriceColumn({
 *   id: "bestPrice",
 *   title: "Best",
 *   accessorKey: "best_price",
 *   accessorKey2: "best_price2",
 *   className: "font-medium",
 *   headerClassName: "max-w-[50px]",
 *   enableSorting: true,
 *   devise: "$", // Optional, defaults to "€"
 * });
 */

export function createTwoPriceColumn({
  id,
  title,
  accessorKey,
  accessorKey2,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  devise = "€",
  devise2 = "€",
  hideFirstPrice,
  hideSecondPrice,
  customPrice,
  customPrice2,
  priceThrougth = false,
  price2Througth = false,
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
      const price2 = customPrice2
        ? customPrice2(datas)
        : getNestedValueFunction(datas, accessorKey2);
      const formattedPrice = price !== null ? Number(price).toFixed(2) : "--";
      const formattedPrice2 =
        price2 !== null ? Number(price2).toFixed(2) : "--";

      return (
        <div>
          {(!hideFirstPrice || (hideFirstPrice && !hideFirstPrice(datas))) && (
            <div
              className={cn(
                "ml-auto flex max-w-[85px] justify-end text-end",
                className,
                priceThrougth && "line-through decoration-1"
              )}
            >
              {formattedPrice}
              {` ${devise}`}
            </div>
          )}
          {(!hideSecondPrice ||
            (hideSecondPrice && !hideSecondPrice(datas))) && (
            <div
              className={cn(
                "ml-auto flex max-w-[85px] justify-end text-end font-bold",
                className,
                price2Througth && "line-through decoration-1"
              )}
            >
              {formattedPrice2}
              {` ${devise2}`}
            </div>
          )}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
