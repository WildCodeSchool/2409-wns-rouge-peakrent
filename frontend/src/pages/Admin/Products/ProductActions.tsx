import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { UpdateProductForm } from "./UpdateProductForm";

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

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={<UpdateProductForm product={product} />}
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
