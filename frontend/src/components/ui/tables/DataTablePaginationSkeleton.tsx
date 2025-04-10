import { Skeleton } from "@/components/ui/skeleton";

export default function DataTablePaginationSkeleton() {
  return (
    <div className="my-4 flex items-center justify-end sm:justify-between">
      <div className="flex-1 text-left max-sm:hidden">
        <Skeleton className="hidden h-8 w-40 shrink-0 lg:block" />
      </div>
      <div className="flex items-center space-x-2 lg:space-x-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="hidden h-8 w-24 lg:block" />
          <Skeleton className="h-8 w-[4.2rem]" />
        </div>
        <div className="flex w-[100px] items-center justify-center">
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="hidden size-8 lg:block" />
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
          <Skeleton className="hidden size-8 lg:block" />
        </div>
      </div>
    </div>
  );
}
