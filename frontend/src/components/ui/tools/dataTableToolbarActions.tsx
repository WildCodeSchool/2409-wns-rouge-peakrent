import { exportTableToCSV } from "@/components/ui/tools/export";
import { useDeleteModal } from "@/context/deleteModalProvider";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { DownloadIcon } from "@radix-ui/react-icons";
import { TrashIcon } from "lucide-react";

import {
  DataTableToolbarActionsProps,
  SelectFunction,
} from "@/types/datasTable";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";

export function DataTableToolbarActions({
  table,
  onDeleteMultipleFunction,
  multipleSelectFunctions = [], // default empty array
  hideExport = false,
}: DataTableToolbarActionsProps) {
  const { openModal } = useDeleteModal();
  const { pathname } = useLocation();
  const time = new Date().getTime();

  const handleDeleteMultiple = async (selectedRows: any[]) => {
    const idsToDelete = selectedRows.map((row) => row.original.id);
    if (onDeleteMultipleFunction) {
      openModal(
        idsToDelete as string[] | number[],
        onDeleteMultipleFunction,
        table
      );
    }
  };

  const handleTriggerAction = async (
    action: SelectFunction,
    selectedRows: any[]
  ) => {
    try {
      // Await result in case it's a promise
      const result = await action.onTrigger(selectedRows);

      if (result === true) {
        // Toggle selection for all selected rows
        table.toggleAllPageRowsSelected(false);
      }
    } catch (error) {
      console.error("Error while triggering action: ", error);
    }
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  return (
    <div className="flex items-center gap-2">
      {selectedRows.length > 0 &&
        multipleSelectFunctions
          .filter((action) =>
            action.condition ? action.condition(selectedRows) : true
          ) // Only show buttons that meet the condition
          .map((action, index) => (
            <Button
              key={index}
              variant={action.variant ? action.variant : "primary"}
              size="sm"
              onClick={() => handleTriggerAction(action, selectedRows)}
              className={cn("gap-1 xl:gap-0", action.className ?? "")}
              disabled={action.isPending}
            >
              {action.isPending ? (
                <LoadIcon size={24} />
              ) : (
                <>
                  {action.icon}
                  <span className="hidden xl:mr-1 xl:block">
                    {action.text}
                  </span>{" "}
                  ({selectedRows.length})
                </>
              )}
            </Button>
          ))}
      {selectedRows.length > 0 && onDeleteMultipleFunction && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            handleDeleteMultiple(table.getFilteredSelectedRowModel().rows)
          }
          className="gap-1 xl:gap-0"
        >
          <TrashIcon className="size-4 xl:mr-2" aria-hidden="true" />
          <span className="hidden lg:block xl:mr-1">{"delete"}</span> (
          {table.getFilteredSelectedRowModel().rows.length})
        </Button>
      )}
      {!hideExport && (
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            exportTableToCSV(table, {
              filename: `${pathname}-${time}`,
              excludeColumns: ["select", "actions"],
            })
          }
        >
          <DownloadIcon className="size-4 xl:mr-2" aria-hidden="true" />
          <span className="hidden xl:block">{"export"}</span>
        </Button>
      )}
    </div>
  );
}
