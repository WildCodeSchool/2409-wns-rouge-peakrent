import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";

interface DataTableRowUsersActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowUsersActions<TData>({
  row,
}: DataTableRowUsersActionsProps<TData>) {
  const user = row.original as any;

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Form content</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editUserAriaLabel"}
        variant="primary"
        modalTitle="Modifier l'utilisateur"
        modalDescription={user.email}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([user.id])}
        elementIds={[user.id]}
        ariaLabel={"deleteUserAriaLabel"}
        modalTitle="Supprimer l'utilisateur"
        modalDescription="Voulez-vous vraiment supprimer cet utilisateur ?"
      />
    </div>
  );
}
