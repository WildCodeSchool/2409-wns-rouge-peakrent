import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import CopyButton from "@/components/buttons/CopyButton";
import { getNestedValueFunction } from "../utils/getNestedValue";

/**
 * Creates a name/SKU column for a table.
 *
 * @param {Object} params - The parameters to configure the column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the name.
 * @param {string} params.skuAccessorKey - Accessor key to retrieve the SKU.
 * @param {string} [params.supplementaryAccessorKey] - Accessor key to retrieve supplementary information.
 * @param {string} [params.supplementaryText] - Text to display after the supplementary information.
 * @param {string} [params.className] - Additional CSS classes for both header and cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.supplementaryClassName] - Additional CSS classes for the supplementary information.
 * @param {boolean} [params.enableHiding=true] - Indicates if the column can be hidden.
 * @param {boolean} [params.enableSorting=true] - Indicates if the column can be sorted.
 * @param {function} [params.filterFn] - Custom filter function for the column.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @param {boolean} [params.withCopy=true] - Indicates if the column content should be copyable.
 *
 * @example
 * const nameColumn = createNameColumn({
 *   id: "name",
 *   title: "Name / SKU",
 *   accessorKey: "name",
 *   skuAccessorKey: "sku",
 *   className: "max-w-[120px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]",
 * });
 */
export function createNameAndSkuColumn({
  id,
  title,
  accessorKey,
  skuAccessorKey,
  supplementaryAccessorKey,
  supplementaryText,
  className,
  headerClassName,
  supplementaryClassName,
  enableHiding = true,
  enableSorting = true,
  filterFn,
  withCopy = true,
}: {
  id: string;
  title: string;
  accessorKey: string;
  skuAccessorKey: string;
  supplementaryAccessorKey?: string;
  supplementaryText?: string;
  className?: string;
  headerClassName?: string;
  supplementaryClassName?: string;
  enableHiding?: boolean;
  enableSorting?: boolean;
  filterFn?: FilterFn<any>;
  withCopy?: boolean;
}): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn(
          "max-w-[120px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]",
          headerClassName
        )}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const name = getNestedValueFunction(datas, accessorKey);
      const sku = getNestedValueFunction(datas, skuAccessorKey);
      const supplementary = supplementaryAccessorKey
        ? getNestedValueFunction(datas, supplementaryAccessorKey)
        : null;
      return (
        <div
          className={cn(
            "flex max-w-[120px] flex-col gap-1 md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]",
            className
          )}
        >
          <span className="truncate font-bold" title={name}>
            {name}
          </span>
          <div
            className={cn("flex items-center gap-2", supplementary && "gap-8")}
          >
            <span className="text-muted-foreground">{sku}</span>
            <span
              className={cn("text-muted-foreground", supplementaryClassName)}
            >
              {supplementary} {supplementaryText}
            </span>
            {withCopy && sku && <CopyButton toCopy={sku} />}
          </div>
        </div>
      );
    },
    enableHiding,
    enableSorting,
    filterFn,
  };
}
