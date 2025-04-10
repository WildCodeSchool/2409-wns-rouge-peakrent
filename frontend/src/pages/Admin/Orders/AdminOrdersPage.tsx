import OrdersTable from "./OrdersTable";

export function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Commandes</h1>
      <section className="mt-5">
        <OrdersTable />
      </section>
    </div>
  );
}
