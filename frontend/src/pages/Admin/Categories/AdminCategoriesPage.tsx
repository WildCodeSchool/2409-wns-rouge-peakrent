import CategoriesTable from "./CategoriesTable";

export function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Catégories</h1>
      <section className="mt-5">
        <CategoriesTable />
      </section>
    </div>
  );
}
