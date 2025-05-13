import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalProvider";
import { Plus } from "lucide-react";
import { ActivitiesTable } from "./ActivitiesTable";
import { ActivityForm } from "./ActivityForm";

export function AdminActivitiesPage() {
  const { openModal, setTitle, setDescription } = useModal();
  const handleOpenModal = () => {
    setTitle("Nouvelle activité");
    setDescription("Créer une nouvelle activité");
    openModal(<ActivityForm />);
  };
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Activités
        </h1>
        <Button onClick={handleOpenModal}>
          <Plus size={16} className="mr-2" />
          Nouvelle activité
        </Button>
      </div>
      <section className="mt-5">
        <ActivitiesTable />
      </section>
    </div>
  );
}
