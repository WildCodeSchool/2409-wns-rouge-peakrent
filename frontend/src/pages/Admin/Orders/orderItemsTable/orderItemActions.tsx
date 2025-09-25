import { Button } from "@/components/ui/button";
import { OrderItem as OrderItemType } from "@/gql/graphql";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import DeleteButton from "@/components/buttons/DeleteButton";
import {
  deleteFormOrderItemStore,
  setFormOrderItemStore,
} from "@/stores/admin/order.store";

interface DataTableRowOrderByIdActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowOrderByIdActions<TData>({
  row,
}: DataTableRowOrderByIdActionsProps<TData>) {
  const orderItem = row.original as any;

  const handleDelete = async (id: string | number) => {
    deleteFormOrderItemStore(id as string);
    return true;
  };

  const handleInitOrderItemForm = (orderItem: OrderItemType) => {
    setFormOrderItemStore(orderItem);
  };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <Button
        variant="primary"
        size="icon"
        className="hover:border-input size-8 min-h-8 min-w-8 hover:ring-0"
        onClick={() => handleInitOrderItemForm(orderItem)}
      >
        <Pencil size={18} />
      </Button>
      <DeleteButton
        onDeleteFunction={() => handleDelete(orderItem.id)}
        elementIds={[row.id]}
        ariaLabel="Supprimer le produit"
      />
    </div>
  );
}
