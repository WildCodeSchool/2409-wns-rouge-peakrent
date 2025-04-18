import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { DELETE_MULTIPLE_CATEGORIES } from "@/GraphQL/categories";
import { deleteCategory } from "@/stores/admin/category.store";
import { gql, useMutation } from "@apollo/client";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { CategoryForm } from "./CategoryForm";

interface DataTableRowCategoriesActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowCategoriesActions<TData>({
  row,
}: DataTableRowCategoriesActionsProps<TData>) {
  const category = row.original as any;
  const [deleteCategories] = useMutation(gql(DELETE_MULTIPLE_CATEGORIES));

  const handleDelete = async (ids: string[] | number[]) => {
    try {
      const { data } = await deleteCategories({ variables: { ids } });
      if (data?.deleteCategories && data.deleteCategories.length === 1) {
        toast.success("Catégorie supprimée avec succès");
        deleteCategory(Number(data.deleteCategories[0]));
        return true;
      }
      toast.error("Erreur lors de la suppression de la catégorie");
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de la catégorie");
      return false;
    }
  };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={<CategoryForm datas={category} />}
        ariaLabel={"editCategoryAriaLabel"}
        variant="primary"
        modalTitle="Modifier la catégorie"
        modalDescription={category.name}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete(category.id)}
        elementIds={[category.id]}
        ariaLabel={"deleteCategoryAriaLabel"}
        modalTitle="Supprimer la catégorie"
        modalDescription="Voulez-vous vraiment supprimer cette catégorie ?"
      />
    </div>
  );
}
