import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalProvider";
import { Plus } from "lucide-react";
import CategoriesTable from "./CategoriesTable";
import { CategoryForm } from "./CategoryForm";

export function AdminCategoriesPage() {
  const { openModal, setTitle, setDescription } = useModal();
  const handleOpenModal = () => {
    setTitle("Nouvelle catégorie");
    setDescription("Créer une nouvelle catégorie de produits");
    openModal(<CategoryForm />);
  };
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Catégories
        </h1>
        <Button onClick={handleOpenModal}>
          <Plus size={16} className="mr-2" />
          Nouvelle catégorie
        </Button>
      </div>
      <section className="mt-5">
        <CategoriesTable />
      </section>
    </div>
  );
}
