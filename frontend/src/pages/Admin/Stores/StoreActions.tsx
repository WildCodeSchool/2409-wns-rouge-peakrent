import { useModal } from "@/context/modalProvider";
import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";

interface DataTableRowStoresActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowStoresActions<TData>({
  row,
}: DataTableRowStoresActionsProps<TData>) {
  const store = row.original as any;
  const { openModal, setTitle } = useModal();

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Update store</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editStoreAriaLabel"}
        variant="primary"
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([store.id])}
        elementIds={[store.id]}
        ariaLabel={"deleteStoreAriaLabel"}
      />
    </div>
  );
}
