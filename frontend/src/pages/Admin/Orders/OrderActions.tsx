import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui";
import { Order as OrderType } from "@/gql/graphql";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface DataTableRowOrdersActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowOrdersActions<TData>({
  row,
}: DataTableRowOrdersActionsProps<TData>) {
  const order = row.original as OrderType & { startsAt: Date; endsAt: Date };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <Link to={`/admin/orders/${order.reference}`}>
        <Button
          variant="primary"
          aria-label={"Modifier la commande"}
          size="icon"
          className="size-8"
        >
          <Pencil className="" size={16} />
        </Button>
      </Link>
      {/* <DeleteButton
        onDeleteFunction={() => handleDelete([order.id])}
        elementIds={[order.id]}
        ariaLabel={"deleteOrderAriaLabel"}
        modalTitle="Supprimer la commande"
        modalDescription="Voulez-vous vraiment supprimer cette commande ?"
      /> */}
    </div>
  );
}
