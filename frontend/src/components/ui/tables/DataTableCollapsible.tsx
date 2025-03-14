import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/tools/dataTablePagination";
import { DataTableToolbar } from "@/components/ui/tools/dataTableToolbar";
import useBreakpoints from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { columnBreakpoints } from "./columnBreakpoints";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Meh } from "lucide-react";

import { DataTableProps, RowLink } from "@/types/datasTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function DataTableCollapsible<TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  renderCollapsibleContent,
  hideColumns,
  onDeleteMultipleFunction,
  multipleSelectFunctions,
  hideExport,
  CardComponent,
  viewMode,
  setViewMode,
}: DataTableProps<TData, TValue> & {
  renderCollapsibleContent: (row: any) => React.ReactNode;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      sku: false,
      brand: false,
      status: false,
      address: false,
      complement: false,
      city: false,
      address_country: false,
      zipcode: false,
      phone: false,
      payment_country: false,
      payment_account: false,
      payment_type: false,
      bic: false,
      devise: false,
      ...hideColumns,
    });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { sm, md, lg, xl, xxl } = useBreakpoints();

  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenItems(open ? { [id]: true } : {});
  };

  const endpoints = React.useMemo(
    () => ({ sm, md, lg, xl, xxl }),
    [sm, md, lg, xl, xxl]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    table.getAllColumns().forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(columnBreakpoints, column.id)) {
        const columnEndpoint = columnBreakpoints[column.id];
        column.toggleVisibility(
          endpoints[columnEndpoint as keyof typeof endpoints]
        );
      }
    });
  }, [endpoints, table]);

  const handleRowClick = (
    row: any,
    rowLink: string | RowLink | ((row: any) => any) | undefined
  ) => {
    if (typeof rowLink === "function") {
      rowLink(row);
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterTextOptions={filterTextOptions}
        columnConfigs={columnConfigs}
        onDeleteMultipleFunction={onDeleteMultipleFunction}
        multipleSelectFunctions={multipleSelectFunctions}
        hideExport={hideExport}
        showViewMode={!!CardComponent}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {viewMode === "card" &&
        (() => {
          const selectHeader = table
            .getHeaderGroups()
            .map((headerGroup) =>
              headerGroup.headers.find((header) => header.id === "select")
            )
            .find((header) => header !== undefined);

          const selectAllElement = selectHeader
            ? flexRender(
                selectHeader.column.columnDef.header,
                selectHeader.getContext()
              )
            : null;

          return (
            <div className="flex w-full items-center gap-2">
              {selectAllElement && <div className="">{selectAllElement}</div>}
              <div className="flex-1">
                <DataTablePagination
                  table={table}
                  key={`top-${table.getState().pagination.pageIndex}-${table.getState().pagination.pageSize}`}
                  viewMode={viewMode}
                />
              </div>
            </div>
          );
        })()}
      {viewMode !== "card" ? (
        <div className="overflow-hidden rounded-lg border">
          <Table className="">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Collapsible
                    key={row.id}
                    asChild
                    open={openItems[row.id] || false}
                    onOpenChange={(open) => handleOpenChange(row.id, open)}
                  >
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow
                          key={row.id}
                          data-state={
                            row.getIsSelected() ? "selected" : undefined
                          }
                          className={cn(
                            "cursor-pointer",
                            row.getIsSelected() && "bg-muted"
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              onClick={() => handleRowClick(row, rowLink)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow className="hover:cursor hover:bg-background">
                          <TableCell
                            colSpan={columns.length + 1}
                            className="p-0"
                          >
                            <CollapsibleContent asChild>
                              {renderCollapsibleContent(row.original)}
                            </CollapsibleContent>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {"no-results"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const selectCell = row
                .getVisibleCells()
                .find((cell) => cell.column.id === "select");

              const selectElement = selectCell
                ? flexRender(
                    selectCell.column.columnDef.cell,
                    selectCell.getContext()
                  )
                : null;

              return CardComponent ? (
                <CardComponent
                  key={row.id}
                  row={row}
                  selectElement={selectElement}
                />
              ) : null;
            })
          ) : (
            <div className="col-span-full my-24 flex w-full flex-1 flex-col items-center justify-center gap-4 text-2xl">
              <Meh size={48} />
              <span className="font-medium">{"no-results"}</span>
            </div>
          )}
        </div>
      )}
      <DataTablePagination
        table={table}
        key={`bottom-${table.getState().pagination.pageIndex}-${table.getState().pagination.pageSize}`}
        viewMode={viewMode}
      />
    </div>
  );
}
