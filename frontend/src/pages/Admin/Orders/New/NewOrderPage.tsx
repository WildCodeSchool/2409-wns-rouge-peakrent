import { OrderForm } from "../Form/OrderForm";
import { OrderItemForm } from "../Form/OrderItemForm";
import OrderItemsTable from "../Table/OrderItemsTable";

export function NewOrderPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Nouvelle commande de vente
      </h1>

      <section className="grid grid-cols-10 gap-4">
        <div className="col-span-4 xl:col-span-3">
          <OrderForm />
        </div>
        <div className="col-span-6 xl:col-span-7">
          <OrderItemForm />
          <OrderItemsTable />
        </div>
      </section>
    </>
  );
}
