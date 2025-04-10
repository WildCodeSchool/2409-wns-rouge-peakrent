import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function RowSkeleton({
  nbRows = 5,
  nbColumns = 2,
  width = "auto",
  minWidth = "150px",
  maxWidth = "300px",
}: {
  nbRows?: number;
  nbColumns?: number;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
}) {
  return (
    <>
      {Array.from({ length: nbRows }).map((_, i) => (
        <TableRow key={i} className="hover:bg-background">
          {Array.from({ length: nbColumns }).map((_, j) => (
            <TableCell
              key={j}
              style={{
                width: width,
                minWidth: minWidth,
                maxWidth: maxWidth,
              }}
            >
              <Skeleton className="h-7 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
