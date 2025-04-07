import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

/**
 * Creates a static selection column for a table.
 *
 * @param {(row: any) => boolean} isDisabled - A function to determine if the row's checkbox should be disabled.
 * @param {number | null} maxSelections - The maximum number of rows that can be selected.
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const selectColumn = createSelectColumn((row) => row.original.isLocked);
 */
export function createSelectColumn(
  isDisabled: (row: any) => boolean = () => false,
  maxSelections: number | null = null
): ColumnDef<any> {
  return {
    id: "select",
    header: ({ table }) => {
      const rows = table.getRowModel().rows;

      const selectableRows = rows.filter((row) => !isDisabled(row));
      const selectedCount = selectableRows.filter((row) =>
        row.getIsSelected()
      ).length;

      const firstNSelected = selectableRows
        .slice(0, maxSelections ?? Infinity)
        .every((row) => row.getIsSelected());

      const allNonDisabledRowsSelected = table
        .getRowModel()
        .rows.every((row) => isDisabled(row) || row.getIsSelected());

      return (
        <Checkbox
          checked={
            selectedCount === maxSelections || allNonDisabledRowsSelected
          }
          onCheckedChange={(value) => {
            if (value) {
              let count = selectedCount;
              selectableRows.forEach((row) => {
                if (
                  !row.getIsSelected() &&
                  count < (maxSelections ?? Infinity)
                ) {
                  row.toggleSelected(true);
                  count++;
                }
              });
            } else {
              selectableRows.forEach((row) => {
                row.toggleSelected(false);
              });
            }
          }}
          aria-label="Select all"
          className="bg-primary-foreground text-primary data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary translate-y-0.5 rounded-lg"
        />
      );
    },
    cell: ({ row, table }) => {
      const rows = table.getRowModel().rows;
      const selectedCount = rows.filter((row) => row.getIsSelected()).length;
      const isMaxReached =
        maxSelections !== null &&
        selectedCount >= maxSelections &&
        !row.getIsSelected();

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (!isMaxReached || !value) {
              row.toggleSelected(!!value);
            }
          }}
          aria-label="Select row"
          disabled={isDisabled(row) || isMaxReached}
          className="translate-y-0.5 rounded-lg disabled:bg-red-600 group-[.select-black]:border-black"
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}
