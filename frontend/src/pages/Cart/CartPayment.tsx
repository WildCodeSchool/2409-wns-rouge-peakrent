import { Button } from "@/components/ui/button";
import { VALIDATE_CART } from "@/graphQL/carts";
import { GET_STORE_BY_ID } from "@/graphQL/stores";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";

type OutletContextType = {
  clientSecret: string;
};

export function CartPayment() {
  const { clientSecret } = useOutletContext<OutletContextType>();
  const [paymentType, setPaymentType] = useState("card");
  const PaymentTypeList = [
    { name: "card", key: "card", icon: <CreditCard className="size-10" /> },
    { name: "sur place", key: "onSite", icon: <Store className="size-10" /> },
  ];
  const [validateOrder] = useMutation(gql(VALIDATE_CART));

  const stripe = useStripe();
  const elements = useElements();

  const cart = useCartStoreUser((state) => state.cart);

  const updateCartStore = useCartStoreUser((state) => state.updateCart);
  const deleteOrderItemStore = useOrderItemStore(
    (state) => state.deleteAllOrderItems
  );
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );

  const navigate = useNavigate();

  const { data: storeData } = useQuery(gql(GET_STORE_BY_ID), {
    variables: { param: "1" },
  });
  const store = storeData?.getStoreById;

  useEffect(() => {
    setCommandTunnelStatus(CommandStatusEnum.onPayment);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart?.address1) {
      toast.error("L'adresse est requise pour valider votre commande.");
      return navigate("/cart/checkout");
    }
    try {
      const response = await validateOrder({
        variables: {
          data: {
            paymentMethod: paymentType,
            clientSecret,
          },
        },
      });

      const ref = response.data.validateCart.reference;

      if (paymentType === "card") {
        if (!stripe || !elements) {
          return toast.error("Stripe n'est pas encore chargé.");
        }

        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/cart/recap/${ref}`,
          },
        });

        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            console.error(error);
            return toast.error(error.message);
          }
          console.error(error);
          return toast.error(
            "Une erreur est survenue lors du paiement en ligne."
          );
        }
      }

      deleteOrderItemStore();
      updateCartStore({
        address1: null,
        address2: null,
        city: null,
        zipCode: null,
        country: null,
      });

      navigate(`/cart/recap/${ref}`);
    } catch (err) {
      console.error("Un problème est survenu : ", err);
      toast.error("Un problème est survenu lors du paiement.");
    }
  }

  return (
    <div className="w-full">
      <section className="space-y-2">
        <h2>Selectionner un type de paiement</h2>
        <div className="flex gap-2">
          {PaymentTypeList.map((p) => (
            <Button
              key={p.key}
              variant="outline"
              className={`flex flex-col h-full ${paymentType === p.key && "bg-primary text-primary-foreground"}`}
              onClick={() => {
                setPaymentType(p.key);
              }}
            >
              <span>{p.icon}</span>
              {p.name}
            </Button>
          ))}
        </div>
      </section>
      <section>
        <form
          onSubmit={onSubmit}
          className="space-y-4 my-4 w-full"
          id="payment-form"
        >
          {paymentType === "onSite" ? (
            <div className="space-y-4 my-4 p-6 bg-gray-100">
              <div>
                <p>
                  Vos articles sont à retirer en magasin à l&apos;adresse
                  suivante :
                </p>
                <p>
                  {store?.address1}
                  {store?.address2 ? ", " + store?.address2 : ""},{" "}
                  {store?.zipCode} {store?.country}
                </p>
                <p>du lundi au samedi, de 10h à 19h.</p>
              </div>
              <p>
                <span className="font-semibold">
                  Moyens de paiement acceptés :
                </span>{" "}
                chèque, carte bancaire et espèces.
              </p>
            </div>
          ) : (
            <PaymentElement id="payment-element" />
          )}
        </form>
      </section>
    </div>
  );
}
