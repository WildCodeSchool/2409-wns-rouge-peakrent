import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { formatSize } from "@/utils/formatSize";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface StringColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  accessorKey2?: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  textClassName?: string;
}

/**
 * Creates a string column for a table.
 *
 * @param {Object} params - The parameters to configure the string column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the string value.
 * @param {string} [params.accessorKey2] - Accessor key to retrieve an optional second string value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.textClassName] - Additional CSS classes for the text.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const nameColumn = createStringColumn({
 *   id: "name",
 *   title: "Name",
 *   accessorKey: "name",
 *   className: "text-md font-medium",
 *   headerClassName: "text-center",
 *   enableSorting: true,
 * });
 */
export function createStringColumn({
  id,
  title,
  accessorKey,
  accessorKey2,
  className,
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
        className={cn("mx-auto max-w-[100px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      let stringText = getNestedValueFunction(datas, accessorKey);
      if (accessorKey2) {
        stringText += " " + getNestedValueFunction(datas, accessorKey2);
      }
      if (id === "size") {
        stringText = formatSize(stringText);
      }
      return (
        <div
          className={cn("text-md flex justify-center text-center", className)}
        >
          {stringText ? (
            <span className={cn("", textClassName)}>{stringText}</span>
          ) : (
            <span className={cn("text-muted-foreground", textClassName)}>
              ---
            </span>
          )}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
