import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

interface PriceColumnProps {
  id: string;
  title: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  devise?: string; // Optional devise symbol, defaults to "€"
  price_ht_accessorKey?: string;
  price_ttc_accessorKey?: string;
}

/**
 * Creates a price column for a table.
 *
 * @param {Object} params - The parameters to configure the price column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.devise="€"] - devise symbol to display.
 * @param {string} [params.price_ht_accessorKey="price_ht"] - The accessor key for the price hors taxe.
 * @param {string} [params.price_ttc_accessorKey="price_ttc"] - The accessor key for the price toutes taxes comprises.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const bestPriceColumn = createPriceColumn({
 *   id: "bestPrice",
 *   title: "Best",
 *   className: "font-medium",
 *   headerClassName: "max-w-[50px]",
 *   enableSorting: true,
 *   devise: "$", // Optional, defaults to "€",
 *   price_ht_accessorKey: "best_price",
 *   price_ttc_accessorKey: "best_price_ttc"
 * });
 */
export function createDoublePriceColumn({
  id,
  title,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  devise = "€",
  price_ht_accessorKey = "price_ht",
  price_ttc_accessorKey = "price_ttc",
}: PriceColumnProps): ColumnDef<any> {
  return {
    id,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("ml-auto max-w-[85px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      return (
        <div>
          <div
            className={cn(
              "ml-auto flex max-w-[85px] justify-end text-end ",
              className
            )}
          >
            {datas[price_ht_accessorKey]
              ? Number(datas[price_ht_accessorKey]).toFixed(2)
              : "-- "}
            {` ${devise}`}
          </div>

          <div
            className={cn(
              "ml-auto flex max-w-[85px] justify-end text-end font-bold",
              className
            )}
          >
            {datas[price_ttc_accessorKey]
              ? Number(datas[price_ttc_accessorKey]).toFixed(2)
              : "-- "}
            {` ${devise}`}
          </div>
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
