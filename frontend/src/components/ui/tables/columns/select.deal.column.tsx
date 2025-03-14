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
export function createDealSelectColumn(
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

      const firstSelectedRow = selectableRows.find((row) =>
        row.getIsSelected()
      );

      const allNonDisabledRowsSelected = table
        .getRowModel()
        .rows.every(
          (row) =>
            row.getIsSelected() ||
            isDisabled(row) ||
            (firstSelectedRow &&
              firstSelectedRow?.original?.address_id !==
                row.original.address_id)
        );

      return (
        <Checkbox
          checked={
            selectedCount === maxSelections || allNonDisabledRowsSelected
          }
          onCheckedChange={(value) => {
            if (value) {
              let count = selectedCount;
              const addressId = firstSelectedRow
                ? firstSelectedRow.original.address_id
                : selectableRows[0]?.original.address_id;

              selectableRows.forEach((row) => {
                if (
                  !row.getIsSelected() &&
                  count < (maxSelections ?? Infinity) &&
                  row.original.address_id === addressId
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

      const firstSelectedRow = table
        .getRowModel()
        .rows.find((row) => row.getIsSelected());

      const isDifferentAddressFromFirstSelected = (row: any) => {
        return (
          firstSelectedRow &&
          row.original.address_id != firstSelectedRow?.original.address_id
        );
      };

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (!isMaxReached || !value) {
              row.toggleSelected(!!value);
            }
          }}
          aria-label="Select row"
          disabled={
            isDisabled(row) ||
            isMaxReached ||
            isDifferentAddressFromFirstSelected(row)
          }
          className="translate-y-0.5 rounded-lg disabled:bg-red-600"
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}
