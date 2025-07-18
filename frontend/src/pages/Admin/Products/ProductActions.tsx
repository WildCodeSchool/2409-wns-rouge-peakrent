import DeleteButton from "@/components/buttons/DeleteButton";
import { Button } from "@/components/ui/button";
import { Product } from "@/gql/graphql";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
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
      <Button
        variant="primary"
        size="icon"
        className="hover:border-input size-8 min-h-8 min-w-8 hover:ring-0"
        onClick={() => navigate(`edit/${product.id}`)}
      >
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
