import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Grid2X2, LayoutGrid } from "lucide-react";

import { DataTableToolbarProps } from "@/types/datasTable";

import { DataTableFacetedFilter } from "./dataTableFacetedFilter";
import { DataTableToolbarActions } from "./dataTableToolbarActions";
import { DataTableViewOptions } from "./dataTableViewOptions";

export function DataTableToolbar<TData>({
  table,
  filterTextOptions,
  columnConfigs,
  onDeleteMultipleFunction,
  multipleSelectFunctions,
  hideExport,
  hideViewOptions,
  showViewMode,
  viewMode,
  setViewMode,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col items-start gap-2 sm:flex-row">
        {filterTextOptions && (
          <Input
            placeholder={filterTextOptions.placeholder}
            value={
              (table
                .getColumn(filterTextOptions.id)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterTextOptions.id)
                ?.setFilterValue(event.target.value)
            }
            className="border-input hover:ring-primary order-2 h-9 w-full border hover:ring-1 sm:order-1 sm:w-[250px]"
          />
        )}
        <div
          className={cn(
            "no-scrollbar order-1 flex w-full max-w-[calc(100vw-1.5rem)] gap-2 overflow-x-auto sm:order-2 sm:max-w-[calc(100vw-2rem-250px)]"
          )}
        >
          {columnConfigs &&
            columnConfigs.map((config) => (
              <DataTableFacetedFilter
                key={config.id}
                column={table.getColumn(config.id)}
                title={config.title}
                options={config.options}
                Icon={config.Icon}
              />
            ))}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3"
            >
              <span className="hidden">Reset</span>
              <Cross2Icon className="size-4" />
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <DataTableToolbarActions
              table={table}
              onDeleteMultipleFunction={onDeleteMultipleFunction}
              multipleSelectFunctions={multipleSelectFunctions}
              hideExport={hideExport}
            />
            {viewMode !== "card" && (
              <DataTableViewOptions
                table={table}
                hideViewOptions={hideViewOptions}
              />
            )}
            {showViewMode && (
              <Tabs
                defaultValue="table"
                value={viewMode ?? "table"}
                onValueChange={(value) =>
                  setViewMode && setViewMode(value as "table" | "card")
                }
                className="min-w-[64px]"
              >
                <TabsList className="border-input grid size-full grid-cols-2 gap-1 rounded-md border p-1">
                  <TabsTrigger
                    value="table"
                    className="data-[state=active]:text-primary text-muted-foreground flex items-center gap-2 rounded-md p-1"
                  >
                    <Grid2X2 className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="card"
                    className="data-[state=active]:text-primary text-muted-foreground flex items-center gap-2 rounded-md p-1"
                  >
                    <LayoutGrid className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
