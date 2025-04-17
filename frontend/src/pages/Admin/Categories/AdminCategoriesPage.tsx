import { Button } from "@/components/ui/button";
import CategoriesTable from "./CategoriesTable";
import { Plus } from "lucide-react";
import { useModal } from "@/context/modalProvider";
import { CategoryForm } from "./CategoryForm";

export function AdminCategoriesPage() {
  const { openModal } = useModal();
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Catégories
        </h1>
        <Button onClick={() => openModal(<CategoryForm />)}>
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
