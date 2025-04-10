import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/context/modalProvider";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  formContent: any;
  schema: any;
}

export function DataTableRowActions<TData>({
  row,
  formContent,
  schema,
}: DataTableRowActionsProps<TData>) {
  const currentRow = schema.parse(row.original);
  const { openModal } = useModal();

  return (
    <DropdownMenu key={currentRow.id}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex size-8 p-0"
        >
          <DotsHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem key="more">More</DropdownMenuItem>
        <DropdownMenuSeparator key="separator" />
        <DropdownMenuItem key="edit">
          <Button
            variant="ghost"
            className="h-fit w-full p-0"
            onClick={() => {
              openModal(formContent);
            }}
          >
            Edit
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem key="delete">
          <Button
            variant="ghost"
            className="h-fit w-full p-0"
            onClick={() => {
              openModal(formContent);
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
