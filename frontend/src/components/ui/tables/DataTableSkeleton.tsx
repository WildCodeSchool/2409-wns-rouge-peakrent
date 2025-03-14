import { useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DataTableFiltersSkeleton from "./DataTableFiltersSkeleton";
import DataTablePaginationSkeleton from "./DataTablePaginationSkeleton";

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Columns in the table.
   * @type ColumnDef<any>[]
   */
  columns: ColumnDef<any>[];

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number;

  /**
   * The number of searchable columns in the table.
   * @default 0
   * @type number | undefined
   */
  searchableColumnCount?: number;

  /**
   * The number of filterable columns in the table.
   * @default 0
   * @type number | undefined
   */
  filterableColumnCount?: number;

  /**
   * Flag to show the table view options.
   * @default undefined
   * @type boolean | undefined
   */
  showViewOptions?: boolean;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[];

  /**
   * The height of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS height value is accepted.
   * @default 40
   * @type string | undefined
   */
  cellHeights?: number;

  /**
   * Flag to show the pagination bar.
   * @default true
   * @type boolean | undefined
   */
  withPagination?: boolean;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columns,
    rowCount = 10,
    searchableColumnCount = 0,
    filterableColumnCount = 0,
    showViewOptions = true,
    cellWidths = ["auto"],
    cellHeights = 40,
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedRowCount, setCalculatedRowCount] = useState(rowCount);

  useEffect(() => {
    const calculateRows = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const cellHeightValue = cellHeights || 40;
        const rows = Math.floor(containerHeight / cellHeightValue);
        setCalculatedRowCount(Math.max(1, rows));
      }
    };

    calculateRows();
    window.addEventListener("resize", calculateRows);
    return () => window.removeEventListener("resize", calculateRows);
  }, [cellHeights]);

  return (
    <div
      className={cn("w-full space-y-2.5 overflow-auto", className)}
      {...skeletonProps}
    >
      <DataTableFiltersSkeleton
        searchableColumnCount={searchableColumnCount}
        filterableColumnCount={filterableColumnCount}
        showViewOptions={showViewOptions}
      />
      <div className="rounded-md border" ref={containerRef}>
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i}>
                {columns.slice(0, 8).map((column) => (
                  <TableHead
                    key={column.id}
                    style={{
                      width: "auto",
                      minWidth: "auto",
                    }}
                  >
                    <Skeleton className="bg-primary-foreground/10 h-8 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: calculatedRowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: Math.min(columns.length, 8) }).map(
                  (_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: cellWidths[j],
                        minWidth: shrinkZero ? cellWidths[j] : "auto",
                        height: cellHeights + "px",
                      }}
                    >
                      <Skeleton className="size-full min-h-8" />
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? <DataTablePaginationSkeleton /> : null}
    </div>
  );
}
