import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Table from "@/components/ui/tables/Table";
import {
  deleteMultipleOrderItems,
  useOrderStore,
} from "@/stores/admin/order.store";
import { createColumns } from "./orderItemsColumns";

export default function OrderItemsTable() {
  const orderItems = useOrderStore((state) => state.orderItemsForm);

  const onDeleteMultipleFunction = async (ids: (string | number)[]) => {
    deleteMultipleOrderItems(ids);
    return true;
  };

  const totalTTC =
    orderItems?.reduce(
      (acc, item) =>
        acc +
        (item.pricePerHour *
          item.quantity *
          (item.endsAt.getTime() - item.startsAt.getTime())) /
          (1000 * 60 * 60 * 24),
      0
    ) || 0;

  return (
    <Card className="px-0 py-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-md">Produits</CardTitle>
          <p>
            Total: <span className="font-bold"> {totalTTC.toFixed(2)} €</span>
          </p>
        </div>
        <div className="flex justify-between">
          <CardDescription>
            Liste des produits ajoutés à la commande
          </CardDescription>
          <p>
            Total TTC:{" "}
            <span className="font-bold"> {totalTTC.toFixed(2)} €</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Table
          data={orderItems ?? []}
          columns={createColumns()}
          filterTextOptions={{
            id: "name",
            placeholder: "Rechercher un produit",
          }}
          hideExport
          hideColumns={{}}
          onDeleteMultipleFunction={onDeleteMultipleFunction}
        />
      </CardContent>
    </Card>
  );
}
