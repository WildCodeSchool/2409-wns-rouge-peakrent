import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white p-0 gap-0">
      <CardHeader className="relative w-full overflow-hidden bg-white p-0">
        <Skeleton className="w-full h-[200px] md:h-[250px] border-b" />
        <div className="absolute right-2 top-2 z-10 rounded-lg">
          <Skeleton className="h-7 w-12 rounded-lg bg-black/10" />
        </div>
      </CardHeader>
      <CardContent className="sm:px-4 py-0 px-2">
        <div className="flex items-center gap-2 capitalize mb-1">
          <Skeleton className="h-[1.875rem] w-16 rounded-lg" />
          <Skeleton className="h-[1.875rem] w-16 rounded-lg" />
        </div>
        <CardTitle className="line-clamp-2 h-[48px] min-h-[48px] md:h-[56px] md:min-h-[56px]">
          <Skeleton className="h-5 w-3/4 my-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardTitle>
        <div className="flex items-center gap-1 mt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>
      </CardContent>
      <CardFooter className="sm:p-4 p-2 sm:pt-2">
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
