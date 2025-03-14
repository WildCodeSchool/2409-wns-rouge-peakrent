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
import { useNavigate } from "react-router-dom";

export function DataTable<TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  onDeleteMultipleFunction,
  multipleSelectFunctions,
  hideColumns,
  hideExport,
  CardComponent,
  viewMode,
  setViewMode,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      sku: false,
      brand: false,
      ...hideColumns,
    });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { sm, md, lg, xl, xxl } = useBreakpoints();

  const navigate = useNavigate();

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
    cell: any,
    row: any,
    rowLink: string | RowLink | ((row: any) => any) | undefined
  ) => {
    if (cell.column.id !== "actions" && !rowLink) {
      if (onDeleteMultipleFunction || multipleSelectFunctions) {
        row.toggleSelected(!row.getIsSelected());
      }
    } else {
      if (
        rowLink &&
        cell.column.id !== "actions" &&
        cell.column.id !== "select" &&
        cell.column.id !== "product_id"
      ) {
        const datas: any = row.original;

        // Check if rowLink is a function
        if (typeof rowLink === "function") {
          rowLink(row);
        } else if (typeof rowLink === "object") {
          // If rowLink is an object, use the customPath and rowLink property
          navigate(`${rowLink.customPath}/${datas[rowLink.rowLink]}`);
        } else {
          // Otherwise, treat it as a string and append to the current pathname
          navigate(`/${datas[rowLink]}`);
        }
      }
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer",
                      row.getIsSelected() && "bg-muted"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => handleRowClick(cell, row, rowLink)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
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
