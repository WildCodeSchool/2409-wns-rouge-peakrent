import { Skeleton } from "@/components/ui/skeleton";

export default function DataTableFiltersSkeleton({
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  showViewMode = false,
}: {
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  showViewMode?: boolean;
}) {
  return (
    <div className="flex items-center justify-between overflow-hidden">
      <div className="flex flex-1 flex-col items-start gap-2 sm:flex-row">
        {searchableColumnCount > 0
          ? Array.from({ length: searchableColumnCount }).map((_, i) => (
              <Skeleton
                key={i}
                className="order-2 h-9 w-full sm:order-1 sm:w-[250px]"
              />
            ))
          : null}
        <div className="no-scrollbar order-1 flex w-full gap-2 sm:order-2">
          {filterableColumnCount > 0
            ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-10" />
              ))
            : null}

          <div className="ml-auto flex gap-2">
            {showViewMode ? <Skeleton className="ml-auto h-9 w-16" /> : null}
            {showViewOptions ? (
              <Skeleton className="ml-auto h-9 w-10 md:w-[6.5rem]" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
