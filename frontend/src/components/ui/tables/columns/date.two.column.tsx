import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { formatLocaleDate } from "@/utils/getLocaleDateAndTime";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface DateColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  secondAccessorKey: string;
  showTime?: boolean;
  divClassName?: string;
  headerClassName?: string;
  dateClassName?: string;
  timeClassName?: string;
  filterFn?: FilterFn<any>;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

/**
 * Creates a date column for a table.
 *
 * @param {Object} params - The parameters to configure the date column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the date.
 * @param {string} params.secondAccessorKey - Second accessor key to retrieve the date.
 * @param {boolean} [params.showTime=false] - Indicates if the time should be displayed.
 * @param {string} [params.divClassName] - Additional CSS classes for the div container.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.dateClassName] - Additional CSS classes for the date.
 * @param {string} [params.timeClassName] - Additional CSS classes for the time.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const dateColumn = createDateColumn({
 *   id: "date",
 *   title: "Date",
 *   accessorKey: "created_at",
 *   secondAccessorKey: "updated_at",
 *   showTime: true,
 *   divClassName: "flex items-center justify-center",
 *   headerClassName: "text-left",
 *   dateClassName: "text-lg font-bold",
 *   timeClassName: "text-sm text-gray-500",
 *   enableSorting: true, // Enable sorting for this column
 *   enableHiding: true,   // Enable hiding for this column
 * });
 */
export function createTwoDateColumn({
  id,
  title,
  accessorKey,
  secondAccessorKey,
  showTime = false,
  divClassName,
  headerClassName,
  dateClassName,
  timeClassName,
  filterFn,
  enableSorting = false, // Default to false
  enableHiding = false, // Default to false
}: DateColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[50px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const { date, time } = formatLocaleDate(
        getNestedValueFunction(datas, accessorKey)
      );

      const { date: secondDate, time: secondTime } = formatLocaleDate(
        getNestedValueFunction(datas, secondAccessorKey)
      );

      return (
        <div
          className={cn(
            "mx-auto flex max-w-[50px] flex-col items-center justify-center",
            divClassName
          )}
        >
          <div className="flex flex-col items-center justify-center">
            <span className={cn("font-medium ", dateClassName)}>{date}</span>
            {showTime && (
              <span
                className={cn("text-muted-foreground text-sm", timeClassName)}
              >
                {time}
              </span>
            )}
          </div>
          <ChevronDown size={12} />
          <div className="flex flex-col items-center justify-center">
            <span className={cn("font-medium ", dateClassName)}>
              {secondDate}
            </span>
            {showTime && (
              <span
                className={cn("text-muted-foreground text-sm", timeClassName)}
              >
                {secondTime}
              </span>
            )}
          </div>
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
