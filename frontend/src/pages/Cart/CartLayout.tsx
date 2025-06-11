import Resume from "@/components/resume/Resume";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { cn } from "@/lib/utils";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function CartLayout() {
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
    <main className="mx-2 lg:mx-28 max-w-screen-xl">
      {orderCommandStatus === CommandStatusEnum.pending && (
        <Title
          text="Panier de commande"
          className="my-4 md:my-6"
          icon={<ShoppingBag className="size-8" />}
        />
      )}
      {(orderCommandStatus === CommandStatusEnum.validated ||
        orderCommandStatus === CommandStatusEnum.onPayment) && (
        <>
          <Title
            text="Checkout"
            className="my-4 md:my-6"
            icon={<CreditCard className="size-8" />}
          />
          <p>Adresse de facturation et informations de paiement</p>
          <hr className="border-t-2 border-gray-300 my-2" />
        </>
      )}

      {orderItems.length > 0 ? (
        <div className="lg:grid lg:grid-cols-2 flex flex-col items-center lg:items-start gap-6 mb-4">
          <Outlet />
          <aside className="flex flex-col lg:sticky lg:top-16 lg:h-fit gap-4 w-full justify-center items-center">
            <div className="self-center w-full lg:lg:w-2/3 flex flex-col items-stretch lg:items-end gap-4">
              <Resume orderItems={orderItems} promo={0} />

              {orderCommandStatus === CommandStatusEnum.pending && (
                <NavLink
                  to="checkout"
                  aria-label="Navigation vers la page de paiement"
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    "py-2 px-4 cursor-pointer text-center w-full lg:max-w-[250px]"
                  )}
                >
                  {" "}
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
                  className="py-2 px-4 cursor-pointer text-center w-full lg:max-w-[250px]"
                >
                  {orderCommandStatus === CommandStatusEnum.validated
                    ? "Valider ma commande"
                    : "Valider le paiement"}
                </Button>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <p className="text-gray-500 mt-10">
          Vous n&apos;avez aucun produit dans votre panier.
        </p>
      )}
    </main>
  );
}
