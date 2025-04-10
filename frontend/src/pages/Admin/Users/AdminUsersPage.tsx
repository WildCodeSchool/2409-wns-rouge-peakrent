import UsersTable from "./UsersTable";

export function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Utilisateurs</h1>
      <section className="mt-5">
        <UsersTable />
      </section>
    </div>
  );
}
