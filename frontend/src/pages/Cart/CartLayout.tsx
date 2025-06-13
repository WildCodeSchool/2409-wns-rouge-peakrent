import AdressResume from "@/components/resume/AdressResume";
import TotalResume from "@/components/resume/TotalResume";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { useUser } from "@/context/userProvider";
import { cn } from "@/lib/utils";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function CartLayout() {
  const { user: userData } = useUser();
  const cart = useCartStoreUser((state) => state.cart);
  const orderItems = useOrderItemStore((state) => state.orderItems);
  const orderCommandStatus = useCartStoreUser(
    (state) => state.commandTunnelStatus
  );
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );

  useEffect(() => {
    if (orderItems.length === 0) {
      setCommandTunnelStatus(CommandStatusEnum.pending);
    }
  }, [orderItems]);

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      {/* Header Section */}
      <div className="mb-6">
        {orderCommandStatus === CommandStatusEnum.pending && (
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

        {(orderCommandStatus === CommandStatusEnum.validated ||
          orderCommandStatus === CommandStatusEnum.onPayment) && (
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

      {orderItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Content Section - scrollable */}
          <div className="lg:col-span-8 space-y-4">
            <Outlet />
          </div>

          {/* Sidebar Section - STICKY */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {orderCommandStatus === CommandStatusEnum.onPayment && (
                <AdressResume cart={cart} user={userData} className="w-full" />
              )}

              <TotalResume
                orderItems={orderItems}
                promo={0}
                className="w-full"
              />

              {/* Action Buttons */}
              {orderCommandStatus === CommandStatusEnum.pending && (
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

              {(orderCommandStatus === CommandStatusEnum.validated ||
                orderCommandStatus === CommandStatusEnum.onPayment) && (
                <Button
                  form={
                    orderCommandStatus === CommandStatusEnum.validated
                      ? "checkout-form"
                      : "payment-form"
                  }
                  type="submit"
                  aria-label="Navigation vers la page de paiement"
                  variant="primary"
                  className="w-full"
                >
                  {orderCommandStatus === CommandStatusEnum.validated
                    ? "Valider ma commande"
                    : "Valider le paiement"}
                </Button>
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
