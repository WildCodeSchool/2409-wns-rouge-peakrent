import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import OrdersTable from "./OrdersTable";

export function AdminOrdersPage() {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Commandes
        </h1>
        <NavLink
          to="/admin/orders/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle commande
        </NavLink>
      </div>
      <section className="mt-5">
        <OrdersTable />
      </section>
    </div>
  );
}
