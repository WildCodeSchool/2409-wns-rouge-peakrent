import CopyButton from "@/components/buttons/CopyButton";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import truncateTextWithEllipsisMiddle from "@/utils/truncateTextWithEllipsisMiddle";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { getNestedValueFunction } from "../utils/getNestedValue";

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
  valueKey?: string;
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
 * @param {boolean} [params.withCopy=false] - Indicates if the column has a copy button.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.valueKey] - Key to use for extracting the value from an object.
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
export function createStringTableColumn({
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
  withCopy = false,
  extraText,
  valueKey,
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
      const tables = getNestedValueFunction(datas, accessorKey);
      if (!Array.isArray(tables)) {
        return;
      }
      return (
        <div
          className={cn(
            "text-md flex flex-col items-center justify-center gap-2 text-center",
            className
          )}
        >
          {tables.map((value) =>
            value ? (
              <div
                key={valueKey ? value[valueKey] : value}
                className="flex items-center gap-2"
              >
                <span
                  className={cn("", textClassName)}
                  title={valueKey ? value[valueKey] : value}
                >
                  {numberEllipsis
                    ? truncateTextWithEllipsisMiddle(
                        valueKey ? value[valueKey] : value,
                        numberEllipsis
                      )
                    : valueKey
                      ? value[valueKey]
                      : value}
                  {extraText}
                </span>
                {withCopy && (
                  <CopyButton toCopy={valueKey ? value[valueKey] : value} />
                )}
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
