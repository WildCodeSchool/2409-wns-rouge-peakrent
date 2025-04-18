import { Row } from "@tanstack/react-table";
import DeleteButton from "@/components/buttons/DeleteButton";
import { Pencil } from "lucide-react";
import { Product } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DataTableRowProductsActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowProductsActions<TData>({
  row,
}: DataTableRowProductsActionsProps<TData>) {
  const navigate = useNavigate();
  const product = row.original as Product;

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <Button onClick={() => navigate(`edit/${product.id}`)}>
        <Pencil size={18} />
      </Button>
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
