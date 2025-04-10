import StoresTable from "./StoresTable";

export function AdminStoresPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Magasins</h1>
      <section className="mt-5">
        <StoresTable />
      </section>
    </div>
  );
}
