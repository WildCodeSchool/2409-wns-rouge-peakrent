import { Row } from "@tanstack/react-table";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";

interface DataTableRowCategoriesActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowCategoriesActions<TData>({
  row,
}: DataTableRowCategoriesActionsProps<TData>) {
  const category = row.original as any;

  const handleDelete = async (ids: string[] | number[]) => {
    return true;
  };

  const formContent = <div>Form content</div>;

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={formContent}
        ariaLabel={"editCategoryAriaLabel"}
        variant="primary"
        modalTitle="Modifier la catégorie"
        modalDescription={category.name}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete([category.id])}
        elementIds={[category.id]}
        ariaLabel={"deleteCategoryAriaLabel"}
        modalTitle="Supprimer la catégorie"
        modalDescription="Voulez-vous vraiment supprimer cette catégorie ?"
      />
    </div>
  );
}
