import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import truncateTextWithEllipsisMiddle from "@/utils/truncateTextWithEllipsisMiddle";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import CopyButton from "@/components/buttons/CopyButton";
import { getNestedValueFunction } from "./utils/getNestedValue";

interface StringColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  textClassName?: string;
  numberEllipsis?: number;
  withCopy?: boolean;
  extraText?: string;
}

/**
 * Creates a string column for a table.
 *
 * @param {Object} params - The parameters to configure the string column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the string value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.extraText] - Additional text to display in the cell.
 * @param {boolean} [params.textClassName] - Additional CSS classes for the text.
 * @param {boolean} [params.numberEllipsis] - Number of characters to truncate the text.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {boolean} [params.withCopy=true] - Indicates if the column has a copy button.
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
export function createStringTableWithCopyButtonColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  textClassName,
  numberEllipsis,
  withCopy = true,
  extraText,
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
      const strings = getNestedValueFunction(datas, accessorKey);
      if (!Array.isArray(strings)) {
        return;
      }
      return (
        <div
          className={cn(
            "text-md flex flex-col items-center justify-center gap-2 text-center",
            className
          )}
        >
          {strings.map((stringText) =>
            stringText ? (
              <div key={stringText} className="flex items-center gap-2">
                <span className={cn("", textClassName)} title={stringText}>
                  {numberEllipsis
                    ? truncateTextWithEllipsisMiddle(stringText, numberEllipsis)
                    : stringText}
                  {extraText}
                </span>
                {withCopy && <CopyButton toCopy={stringText} />}
              </div>
            ) : (
              <span
                key={`empty-${Math.random()}`}
                className={cn("text-muted-foreground", textClassName)}
              >
                ---
              </span>
            )
          )}
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
