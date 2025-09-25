import { OrderForm } from "../form/OrderForm";
import { OrderItemForm } from "../form/OrderItemForm";
import OrderItemsTable from "../orderItemsTable/OrderItemsTable";

export function NewOrderPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Nouvelle commande de vente
      </h1>

      <section className="grid gap-0 md:gap-4 grid-cols-1 md:grid-cols-10">
        <div className="md:col-span-4 xl:col-span-3">
          <OrderForm />
        </div>
        <div className="md:col-span-6 xl:col-span-7">
          <OrderItemForm />
          <OrderItemsTable />
        </div>
      </section>
    </>
  );
}
