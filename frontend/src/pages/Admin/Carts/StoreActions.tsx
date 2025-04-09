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

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Form content</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editStoreAriaLabel"}
        variant="primary"
        modalTitle="Modifier le magasin"
        modalDescription={store.name + " - " + store.reference}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([store.id])}
        elementIds={[store.id]}
        ariaLabel={"deleteStoreAriaLabel"}
        modalTitle="Supprimer le magasin"
        modalDescription="Voulez-vous vraiment supprimer ce magasin ?"
      />
    </div>
  );
}
