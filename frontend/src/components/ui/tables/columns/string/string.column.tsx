import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { formatSize } from "@/utils/formatSize";
import truncateTextWithEllipsisMiddle from "@/utils/truncateTextWithEllipsisMiddle";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import CopyButton from "@/components/buttons/CopyButton";

import { getNestedValueFunction } from "../utils/getNestedValue";

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
  numberEllipsis?: number;
  withCopy?: boolean;
  extraText?: string;
  labelFn?: (row: string) => string;
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
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {boolean} [params.textClassName] - Additional CSS classes for the text.
 * @param {number} [params.numberEllipsis] - Number of characters to truncate the text.
 * @param {boolean} [params.withCopy=false] - Indicates if the column has a copy button.
 * @param {string} [params.extraText] - Additional text to display in the cell.
 * @param {Function} [params.labelFn] - Function to format the string value.
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
  numberEllipsis,
  withCopy = false,
  extraText,
  labelFn,
}: StringColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[120px]", headerClassName)}
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
      stringText = labelFn ? labelFn(stringText) : stringText;
      return (
        <div
          className={cn(
            "text-md flex items-center justify-center gap-2 text-center",
            className
          )}
        >
          {stringText ? (
            <span className={cn("", textClassName)} title={stringText}>
              {numberEllipsis
                ? truncateTextWithEllipsisMiddle(stringText, numberEllipsis)
                : stringText}
              {extraText ? ` ${extraText}` : ""}
            </span>
          ) : (
            <span className={cn("text-muted-foreground", textClassName)}>
              ---
            </span>
          )}
          {withCopy && <CopyButton toCopy={stringText ?? ""} />}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
