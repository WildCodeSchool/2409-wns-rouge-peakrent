import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { Paintbrush } from "lucide-react";

interface DataTableRowStoresActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowStoresActions<TData>({
  row,
}: DataTableRowStoresActionsProps<TData>) {
  const store = row.original as any;

  const handleCleanCart = async (ids: string[] | number[]) => {
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
        onDeleteFunction={() => handleCleanCart([store.id])}
        elementIds={[store.id]}
        className="bg-orange-500 text-white hover:bg-orange-600"
        ariaLabel={"deleteStoreAriaLabel"}
        modalTitle="Vider le panier"
        modalDescription="Voulez-vous vraiment vider ce panier ?"
        confirmButtonValue="Vider le panier"
      >
        <Paintbrush className="w-4 h-4" />
      </DeleteButton>
    </div>
  );
}
