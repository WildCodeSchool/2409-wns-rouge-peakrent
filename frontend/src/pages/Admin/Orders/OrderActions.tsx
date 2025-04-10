import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";

interface DataTableRowOrdersActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowOrdersActions<TData>({
  row,
}: DataTableRowOrdersActionsProps<TData>) {
  const order = row.original as any;

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Update order</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editOrderAriaLabel"}
        variant="primary"
        modalTitle="Modifier la commande"
        modalDescription={"Réf: " + order.reference}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([order.id])}
        elementIds={[order.id]}
        ariaLabel={"deleteOrderAriaLabel"}
        modalTitle="Supprimer la commande"
        modalDescription="Voulez-vous vraiment supprimer cette commande ?"
      />
    </div>
  );
}
