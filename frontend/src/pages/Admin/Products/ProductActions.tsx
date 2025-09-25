import { Button } from "@/components/ui/button";
import { Product } from "@/gql/graphql";
import { UPDATE_PRODUCT } from "@/graphQL/products";
import { gql, useMutation } from "@apollo/client";
import { Row } from "@tanstack/react-table";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DataTableRowProductsActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowProductsActions<TData>({
  row,
}: DataTableRowProductsActionsProps<TData>) {
  const navigate = useNavigate();
  const product = row.original as Product;
  const [updateProduct] = useMutation(gql(UPDATE_PRODUCT));

  const handleTogglePublish = async () => {
    const next = !product.isPublished;
    try {
      await updateProduct({
        variables: {
          updateProductId: String(product.id),
          data: { isPublished: next },
        },
        refetchQueries: ["getProducts", "GetProducts"],
        awaitRefetchQueries: true,
      });
      toast.success(next ? "Produit publié" : "Produit dépublié");
    } catch (e) {
      toast.error("Impossible de changer la publication");
    }
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
      <Button
        variant={product.isPublished ? "destructive" : "secondary"}
        size="icon"
        className="hover:border-input size-8 min-h-8 min-w-8 hover:ring-0"
        onClick={handleTogglePublish}
        aria-label={
          product.isPublished ? "Unpublish product" : "Publish product"
        }
        title={product.isPublished ? "Dépublier" : "Publier"}
      >
        {product.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
      </Button>
    </div>
  );
}
