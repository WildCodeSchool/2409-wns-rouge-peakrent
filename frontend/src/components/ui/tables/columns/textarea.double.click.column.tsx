import { useRef } from "react";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { useModal } from "@/context/modalProvider";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { getNestedValueFunction } from "./utils/getNestedValue";

interface StringColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  filterFn?: FilterFn<any>;
  textClassName?: string;
}

export function CreateStringTableWithModalColumn({
  id,
  title,
  accessorKey,
  className,
  headerClassName,
  enableSorting = false,
  enableHiding = false,
  filterFn,
  textClassName,
}: StringColumnProps): ColumnDef<any> {
  const { openModal, setTitle } = useModal();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("mx-auto max-w-[120px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;
      const stringValue = getNestedValueFunction(datas, accessorKey);

      const handleDoubleClick = () => {
        setTitle("Commentaire");
        openModal(<>To dynamize</>);
      };

      const handleClickWithDoubleClickDetection = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
          handleDoubleClick();
        } else {
          clickTimeout.current = setTimeout(() => {
            clickTimeout.current = null;
          }, 300);
        }
      };

      return (
        <div
          onClick={handleClickWithDoubleClickDetection}
          className={cn(
            "text-md line-clamp-3 max-h-[72px] max-w-[120px] cursor-pointer truncate whitespace-normal",
            className
          )}
        >
          <p
            title={stringValue}
            className={cn(
              textClassName,
              stringValue ? "" : "flex min-h-[72px] items-center justify-center"
            )}
          >
            {stringValue ?? <PlusCircle size={18} className="block" />}
          </p>
        </div>
      );
    },
    enableSorting,
    enableHiding,
    filterFn,
  };
}
