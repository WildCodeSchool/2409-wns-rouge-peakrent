import { CartItemCard } from "@/components/cards/CartItemCard";
import AdressResume from "@/components/resume/AdressResume";
import TotalResume from "@/components/resume/TotalResume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GET_ORDER_BY_ID } from "@/GraphQL/order";
import { gql, useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const translateStatus = (status: string) => {
  const statusTranslations = {
    pending: "En attente",
    confirmed: "Confirmée",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };
  return (
    statusTranslations[status as keyof typeof statusTranslations] || status
  );
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { variant: "blueDark" as const },
    confirmed: { variant: "default" as const },
    in_progress: { variant: "default" as const },
    completed: { variant: "green" as const },
    cancelled: { variant: "destructive" as const },
    refunded: { variant: "secondary" as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: "secondary" as const,
  };

  return <Badge variant={config.variant}>{translateStatus(status)}</Badge>;
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: orderData, loading: loadingOrder } = useQuery(
    gql(GET_ORDER_BY_ID),
    {
      variables: { getOrderByIdId: id },
      skip: !id,
    }
  );

  const order = orderData?.getOrderById; // Utiliser les données factices si aucune donnée n'est récupérée
  const profile = orderData?.getOrderById?.profile || null;

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
          {order.orderItems.map((item: any) => (
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
