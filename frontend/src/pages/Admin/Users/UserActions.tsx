import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { UserForm } from "./UserForm";
import { gql, useMutation } from "@apollo/client";
import { DELETE_PROFILE_BY_ADMIN } from "@/graphQL";
import { toast } from "sonner";

interface DataTableRowUsersActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowUsersActions<TData>({
  row,
}: DataTableRowUsersActionsProps<TData>) {
  const user = row.original as any;

  const [deleteProfile, { loading }] = useMutation(
    gql(DELETE_PROFILE_BY_ADMIN)
  );

  const handleDelete = async (userId: string) => {
    try {
      await deleteProfile({
        variables: { userId: Number(userId) },
      });
      toast.success("Utilisateur supprimé avec succès.");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Échec de la suppression.");
      return false;
    }
  };
  const formContent = <UserForm datas={user} />;

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
        onDeleteFunction={() => handleDelete(user.id)}
        elementIds={[user.id]}
        ariaLabel={"deleteUserAriaLabel"}
        modalTitle="Supprimer l'utilisateur"
        modalDescription="Voulez-vous vraiment supprimer cet utilisateur ?"
      />
    </div>
  );
}
