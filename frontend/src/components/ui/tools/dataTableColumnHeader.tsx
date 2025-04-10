import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  role,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("capitalize text-base", className)} role={role}>
        {title}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
      role={role}
    >
      <Button
        variant="ghost"
        size="sm"
        className="data-[state=open]:bg-primary/80 hover:bg-primary hover:text-primary-foreground/80 mx-auto h-8 text-base"
        onClick={() =>
          column.getIsSorted() === "desc"
            ? column.toggleSorting(false)
            : column.toggleSorting(true)
        }
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 size-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 size-4" />
        ) : (
          <CaretSortIcon className="ml-2 size-4" />
        )}
      </Button>
    </div>
  );
}
