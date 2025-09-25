import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalProvider";
import { Plus } from "lucide-react";
import { UserForm } from "./UserForm";
import UsersTable from "./UsersTable";

export function AdminUsersPage() {
  const { openModal } = useModal();
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Utilisateurs
        </h1>
        <Button onClick={() => openModal(<UserForm />)}>
          <Plus size={16} className="mr-2" />
          Nouvel utilisateur
        </Button>
      </div>
      <section className="mt-5">
        <UsersTable />
      </section>
    </div>
  );
}
