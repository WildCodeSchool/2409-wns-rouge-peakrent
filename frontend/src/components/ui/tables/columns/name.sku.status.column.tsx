import { Badge, BadgeVariantType } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface NameColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  skuKey: string;
  statusKey: string;
  enableHiding?: boolean;
  enableSorting?: boolean;
  filterFn?: FilterFn<any>;
  headerClassName?: string;
  cellClassName?: string;
  skuClassName?: string;
  badgeClassName?: string;
  nameClassName?: string;
  variantFn?: (row: any) => BadgeVariantType;
  labelFn?: (row: any) => string;
}

/**
 * Creates a name column for a table with SKU and status badge.
 *
 * @param {Object} params - The parameters to configure the name column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the name.
 * @param {string} params.skuKey - Accessor key to retrieve the SKU.
 * @param {string} params.statusKey - Accessor key to retrieve the status.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.cellClassName] - Additional CSS classes for the cell.
 * @param {string} [params.skuClassName] - Additional CSS classes for the SKU.
 * @param {string} [params.badgeClassName] - Additional CSS classes for the badge.
 * @param {string} [params.nameClassName] - Additional CSS classes for the name.
 * @param {(row: any) => BadgeVariantType} params.variantFn - Function to determine the badge variant.
 * @param {(row: any) => string} [params.labelFn] - Function to determine the badge label.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const nameColumn = createNameWithSkuAndStatusColumn({
 *   id: "name",
 *   title: "Name / SKU",
 *   accessorKey: "variant.reference.name",
 *   skuKey: "variant.reference.sku",
 *   statusKey: "status",
 * });
 */
export function createNameWithSkuAndStatusColumn({
  id,
  title,
  accessorKey,
  skuKey,
  statusKey,
  enableHiding = false,
  enableSorting = false,
  filterFn,
  headerClassName,
  cellClassName,
  skuClassName,
  badgeClassName,
  nameClassName,
  variantFn,
  labelFn,
}: NameColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn(
          "max-w-[120px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[350px]",
          headerClassName
        )}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const name = getNestedValueFunction(datas, accessorKey);
      const sku = getNestedValueFunction(datas, skuKey);
      const status = getNestedValueFunction(datas, statusKey);

      return (
        <div
          className={cn(
            "flex max-w-[120px] flex-col md:max-w-[200px] lg:max-w-[250px] xl:max-w-[350px]",
            cellClassName
          )}
        >
          <span
            className={cn("truncate font-bold", nameClassName)}
            title={name}
          >
            {name}
          </span>
          <span className={cn("text-muted-foreground", skuClassName)}>
            {sku}
          </span>
          <Badge
            variant={
              variantFn ? variantFn(row) : ("primary" as BadgeVariantType)
            }
            className={cn("mt-1 w-fit rounded-lg px-1 text-xs", badgeClassName)}
          >
            {labelFn ? labelFn(row) : status}
          </Badge>
        </div>
      );
    },
    enableHiding,
    enableSorting,
    filterFn,
  };
}
