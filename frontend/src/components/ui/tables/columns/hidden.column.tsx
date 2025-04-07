import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface HiddenColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  filterFn?: FilterFn<any>;
  enableSorting?: boolean; // Optional sorting flag
}

/**
 * Creates a hidden column for a table.
 *
 * @param {Object} params - The parameters to configure the hidden column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header (though hidden).
 * @param {string} params.accessorKey - Accessor key to retrieve the data for the column.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const skuColumn = createHiddenColumn({
 *   id: "sku",
 *   title: "Name / SKU",
 *   accessorKey: "sku",
 *   filterFn: myCustomFilterFunction, // Optional custom filter function
 *   enableSorting: true, // Optional sorting flag
 * });
 */
export function createHiddenColumn({
  id,
  title,
  accessorKey,
  filterFn,
  enableSorting = false, // Default to false
}: HiddenColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} className="hidden" />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      return getNestedValueFunction(datas, accessorKey);
    },
    enableHiding: false,
    enableSorting,
    filterFn,
  };
}
