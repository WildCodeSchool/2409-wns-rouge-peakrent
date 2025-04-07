import { Badge, BadgeVariantType } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { getNestedValueFunction } from "../utils/getNestedValue";

interface BadgeColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  variantFn: (row: any) => BadgeVariantType;
  labelFn?: (row: any) => string;
}

/**
 * Creates a Badge column for a table.
 *
 * @param {Object} params - The parameters to configure the VAT column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the VAT value.
 * @param {string} [params.className] - Additional CSS classes for the cell.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {(row: any) => BadgeVariantType} params.variantFn - Function to determine the badge variant.
 * @param {(row: any) => string} [params.labelFn] - Function to determine the badge label.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 * @example
 * const vatColumn = createVATColumn({
 *   id: "vat",
 *   title: "VAT",
 *   accessorKey: "vat",
 *   className: "text-md font-medium",
 *   headerClassName: "max-w-[60px]",
 *   enableSorting: true,
 * });
 */
export function createBadgeColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  variantFn,
  labelFn,
}: BadgeColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const stringText = getNestedValueFunction(datas, accessorKey);
      return (
        <Badge
          variant={variantFn(row)}
          className={cn(
            "text-md mx-auto flex w-fit	 rounded-lg px-1 capitalize",
            className
          )}
        >
          {labelFn ? labelFn(row) : stringText}
        </Badge>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
