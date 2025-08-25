import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Order as OrderType } from "@/gql/graphql";
import OrderItemsTable from "./table/OrderItemsTable";

export function OrderByIdDetailsListSection({ order }: { order: OrderType }) {
  return (
    <section className="mt-4">
      <Card className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="p-0">Produits</CardTitle>
          <CardDescription className="p-0">
            Liste des produits de la commande
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full p-0">
          <OrderItemsTable order={order} />
        </CardContent>
      </Card>
    </section>
  );
}
