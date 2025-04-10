import { CartsTable } from "./CartsTable";

export function AdminCartsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Carts</h1>
      <section className="mt-5">
        <CartsTable />
      </section>
    </div>
  );
}
