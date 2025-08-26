import AdressResume from "@/components/resume/AdressResume";
import TotalResume from "@/components/resume/TotalResume";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { useUser } from "@/context/userProvider";
import { GET_ORDER_BY_REF } from "@/graphQL";
import { cn } from "@/lib/utils";
import PageNotFound from "@/pages/NotFound/PageNotFound";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { getStatusBadgeVariant } from "@/utils";
import { translateStatus } from "@/utils/translateStatus";
import { gql, useQuery } from "@apollo/client";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function CartLayout() {
  const { user: userData } = useUser();
  const cart = useCartStoreUser((state) => state.cart);
  const orderItems = useOrderItemStore((state) => state.orderItems);
  const path = location.pathname;
  const { ref } = useParams();
  const {
    data: orderData,
    loading: loadingCommand,
    error: errorOrder,
  } = useQuery(gql(GET_ORDER_BY_REF), {
    variables: { reference: ref },
    skip: !ref,
  });

  const order = orderData?.getOrderByReference;

  const [currentPage, setCurrentPage] = useState<CommandStatusEnum>(
    CommandStatusEnum.pending
  );

  useEffect(() => {
    if (path.startsWith("/cart/recap/ORD-")) {
      setCurrentPage(CommandStatusEnum.completed);
      return;
    }

    if (orderItems.length === 0) {
      setCurrentPage(CommandStatusEnum.pending);
      return;
    }

    switch (path) {
      case "/cart":
        setCurrentPage(CommandStatusEnum.pending);
        break;

      case "/cart/checkout":
        setCurrentPage(CommandStatusEnum.validated);
        break;

      case "/cart/checkout/payment":
        setCurrentPage(CommandStatusEnum.onPayment);
        break;

      default:
        setCurrentPage(CommandStatusEnum.pending);
        break;
    }
  }, [path, orderItems]);

  if (
    currentPage === CommandStatusEnum.completed &&
    errorOrder?.graphQLErrors?.[0]?.extensions?.code === "NOT_FOUND"
  ) {
    return <PageNotFound />;
  }

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      {/* Header Section */}
      <div className="mb-6">
        {currentPage === CommandStatusEnum.pending && (
          <>
            <Title
              text="Panier de commande"
              className="my-4 md:my-6"
              icon={<ShoppingBag className="size-8 text-primary" />}
            />
            <p className="text-slate-600 mb-2">
              Récapitulatif de votre panier de commande
            </p>
            <hr className="border-t border-slate-200 mb-6" />
          </>
        )}

        {(currentPage === CommandStatusEnum.validated ||
          currentPage === CommandStatusEnum.onPayment) && (
          <>
            <Title
              text="Checkout"
              className="my-4 md:my-6"
              icon={<CreditCard className="size-8 text-primary" />}
            />
            <p className="text-slate-600 mb-2">
              Adresse de facturation et informations de paiement
            </p>
            <hr className="border-t border-slate-200 mb-6" />
          </>
        )}
      </div>
      {currentPage === CommandStatusEnum.completed && order && (
        <>
          <Title
            text={`Merci ${userData?.firstname} !`}
            className="my-4 md:my-6"
            icon={<ShoppingBag className="size-8 text-primary" />}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            <p className="text-slate-600 text-base">Votre commande est</p>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {translateStatus(order.status)}
            </Badge>
          </div>
          <p className="text-slate-600 text-base mb-2">REF : {ref}</p>
          <hr className="border-t border-slate-200 mb-6" />
        </>
      )}

      {orderItems.length > 0 || currentPage === CommandStatusEnum.completed ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Content Section - scrollable */}
          <div className="lg:col-span-8 space-y-4">
            <Outlet />
          </div>

          {/* Sidebar Section - STICKY */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {((currentPage === CommandStatusEnum.completed && order) ||
                currentPage === CommandStatusEnum.onPayment) && (
                <AdressResume
                  cart={
                    currentPage === CommandStatusEnum.completed ? order : cart
                  }
                  user={
                    currentPage === CommandStatusEnum.completed
                      ? order.profile
                      : userData
                  }
                  className="w-full"
                  paymentMethod={order?.paymentMethod}
                />
              )}
              {
                <TotalResume
                  orderItems={
                    CommandStatusEnum.completed && order
                      ? order.orderItems
                      : orderItems
                  }
                  promo={0}
                  className="w-full"
                />
              }

              {/* Action Buttons */}
              {currentPage === CommandStatusEnum.pending && (
                <NavLink
                  to="checkout"
                  aria-label="Navigation vers la page de paiement"
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    "py-2 px-4 cursor-pointer text-center w-full block"
                  )}
                >
                  Continuer vers le paiement
                </NavLink>
              )}

              {(currentPage === CommandStatusEnum.validated ||
                currentPage === CommandStatusEnum.onPayment) && (
                <Button
                  form={
                    currentPage === CommandStatusEnum.validated
                      ? "checkout-form"
                      : "payment-form"
                  }
                  type="submit"
                  aria-label="Navigation vers la page de paiement"
                  variant="primary"
                  className="w-full"
                >
                  {currentPage === CommandStatusEnum.validated
                    ? "Valider ma commande"
                    : "Valider le paiement"}
                </Button>
              )}

              {currentPage === CommandStatusEnum.completed && (
                <NavLink
                  to=""
                  aria-label="Consulter mes commandes"
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    "py-2 px-4 cursor-pointer text-center w-full block"
                  )}
                >
                  Consulter mes commandes
                </NavLink>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="size-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">
            Vous n&apos;avez aucun produit dans votre panier.
          </p>
        </div>
      )}
    </div>
  );
}
