import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { Activity as ActivityType } from "@/gql/graphql";
import { DELETE_MULTIPLE_ACTIVITIES } from "@/graphQL/activities";
import { deleteActivity } from "@/stores/admin/activity.store";
import { gql, useMutation } from "@apollo/client";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { ActivityForm } from "./ActivityForm";

interface DataTableRowActivitiesActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActivitiesActions<TData>({
  row,
}: DataTableRowActivitiesActionsProps<TData>) {
  const activity = row.original as ActivityType;
  const [deleteActivitiesAdmin] = useMutation(gql(DELETE_MULTIPLE_ACTIVITIES));

  const handleDelete = async (ids: string[] | number[]) => {
    try {
      const { data } = await deleteActivitiesAdmin({ variables: { ids } });
      if (
        data?.deleteActivitiesAdmin &&
        data.deleteActivitiesAdmin.length === 1
      ) {
        toast.success("Activité supprimée avec succès");
        deleteActivity(Number(data.deleteActivitiesAdmin[0]));
        return true;
      }
      toast.error("Erreur lors de la suppression de l'activité");
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'activité");
      return false;
    }
  };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={<ActivityForm datas={activity} />}
        ariaLabel={"editActivityAriaLabel"}
        variant="primary"
        modalTitle="Modifier l'activité"
        modalDescription={activity.name}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([activity.id])}
        elementIds={[activity.id]}
        ariaLabel={"deleteActivityAriaLabel"}
        modalTitle="Supprimer l'activité"
        modalDescription="Voulez-vous vraiment supprimer cette activité ?"
      />
    </div>
  );
}
