import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  viewMode?: "table" | "card";
}

const cardSizeOptions = [12, 24, 36, 48, 60];
const tableSizeOptions = [10, 20, 30, 40, 50];

export function DataTablePagination<TData>({
  table,
  viewMode,
}: DataTablePaginationProps<TData>) {
  const [pageIndex, setPageIndex] = useState(
    table.getState().pagination.pageIndex
  );
  const [pageSize, setPageSize] = useState(
    table.getState().pagination.pageSize
  );

  const [pageSizeSelectable, setPageSizeSelectable] = useState(
    viewMode === "card" ? cardSizeOptions : tableSizeOptions
  );

  useEffect(() => {
    const pageSizeOptions =
      viewMode === "card" ? cardSizeOptions : tableSizeOptions;
    const indexPageToSet = pageSizeSelectable.findIndex(
      (size) => size === pageSize
    );

    if (indexPageToSet === -1) {
      setPageSize(pageSizeOptions[0]);
    } else {
      setPageSize(pageSizeOptions[indexPageToSet]);
    }

    setPageSizeSelectable(pageSizeOptions);
  }, [viewMode]);

  const handleNextPage = () => {
    setPageIndex((prev) => Math.min(prev + 1, table.getPageCount() - 1));
  };

  const handlePreviousPage = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSetPageIndex = (index: number) => {
    setPageIndex(index);
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
  };

  const totalPageCount = table.getPageCount();

  useEffect(() => {
    if (pageIndex >= totalPageCount) {
      handleSetPageIndex(totalPageCount - 1);
      table.setPageIndex(totalPageCount - 1);
    } else {
      table.setPageIndex(pageIndex);
    }
    table.setPageSize(pageSize);
  }, [pageIndex, pageSize, table, totalPageCount]);

  return (
    <div className="flex items-center justify-end px-2 sm:justify-between">
      <div className="text-muted-foreground flex-1 text-left text-sm max-sm:hidden">
        {table.getCenterRows().length} {"of"}{" "}
        {table.getFilteredRowModel().rows.length}{" "}
        {viewMode === "card" ? "element" : "row"}(s).
      </div>
      <div className="flex items-center space-x-2 lg:space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium max-sm:hidden lg:hidden xl:block">
            {viewMode === "card" ? "elementPerPage" : "rowPerPage"}
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              handleSetPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeSelectable.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {"page"} {pageIndex + 1} {"of"} {table.getPageCount()}
        </div>
        <div className="relative flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => handleSetPageIndex(0)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">{"firstPage"}</span>
            <DoubleArrowLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => handlePreviousPage()}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">{"previousPage"}</span>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => handleNextPage()}
            disabled={pageIndex >= table.getPageCount() - 1}
          >
            <span className="sr-only">{"nextPage"}</span>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => handleSetPageIndex(table.getPageCount() - 1)}
            disabled={pageIndex >= table.getPageCount() - 1}
          >
            <span className="sr-only">{"lastPage"}</span>
            <DoubleArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
