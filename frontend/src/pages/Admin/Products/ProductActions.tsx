import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";

interface DataTableRowProductsActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowProductsActions<TData>({
  row,
}: DataTableRowProductsActionsProps<TData>) {
  const product = row.original as any;

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Form content</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editProductAriaLabel"}
        variant="primary"
        modalTitle="Modifier le produit"
        modalDescription={product.name}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([product.id])}
        elementIds={[product.id]}
        ariaLabel={"deleteProductAriaLabel"}
        modalTitle="Supprimer le produit"
        modalDescription="Voulez-vous vraiment supprimer ce produit ?"
      />
    </div>
  );
}
