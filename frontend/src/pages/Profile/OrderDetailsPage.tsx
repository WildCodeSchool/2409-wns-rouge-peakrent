import { CartItemCard } from "@/components/cards/CartItemCard";
import AdressResume from "@/components/resume/AdressResume";
import TotalResume from "@/components/resume/TotalResume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/gql/graphql";
import { GET_ORDER_BY_REF } from "@/graphQL/order";
import { getStatusBadgeVariant } from "@/utils/getVariants/getStatusBadgeVariant";
import { translateStatus } from "@/utils/translateStatus";
import { gql, useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageNotFound from "../NotFound/PageNotFound";

const getStatusBadge = (status: string) => {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {translateStatus(status)}
    </Badge>
  );
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const { ref } = useParams();

  //TODO Remplacer par une page 404

  const {
    data: orderData,
    loading: loadingOrder,
    error: errorOrder,
  } = useQuery(gql(GET_ORDER_BY_REF), {
    variables: { reference: ref },
    skip: !ref,
  });

  if (errorOrder?.graphQLErrors?.[0]?.extensions?.code === "NOT_FOUND") {
    return <PageNotFound />;
  }

  const order = orderData?.getOrderByReference; // Utiliser les données factices si aucune donnée n'est récupérée
  const profile = orderData?.getOrderByReference?.profile || null;

  if (loadingOrder) {
    return <div>Chargement de la commande...</div>;
  }
  if (!order) {
    return <div>Commande introuvable.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft size={16} />
          Revenir À Mes Commandes
        </Button>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">Commande n° {order.reference}</h1>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {" "}
          {order.orderItems.map((item: OrderItem) => (
            <div key={item.id} className="w-full">
              <CartItemCard item={item} />
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 space-y-6">
          <AdressResume
            cart={order}
            className="w-full"
            user={profile} // Pas de données utilisateur dans l'ordre
            paymentMethod={order.paymentMethod}
          />
          <TotalResume
            orderItems={order.orderItems}
            promo={0}
            className="w-full"
          />
          {order.status === "pending" && (
            <Button
              variant="destructive"
              className="w-full"
              disabled={order.status !== "pending"}
            >
              Annuler Ma Commande
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
