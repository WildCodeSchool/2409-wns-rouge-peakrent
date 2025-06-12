import { StringInput } from "@/components/forms/formField";
import { Button } from "@/components/ui/button";
import { VALIDATE_CART } from "@/GraphQL/carts";
import { GET_STORE_BY_ID } from "@/GraphQL/stores";
import { nameRegex, numberRegex } from "@/schemas/regex";
import { createStringSchema } from "@/schemas/utils";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export function CartPayment() {
  const cart = useCartStoreUser((state) => state.cart);
  const updateCartStore = useCartStoreUser((state) => state.updateCart);
  const deleteOrderItemStore = useOrderItemStore(
    (state) => state.deleteAllOrderItems
  );
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );
  const [paymentType, setPaymentType] = useState("card");
  const PaymentTypeList = [
    { name: "card", key: "card", icon: <CreditCard className="size-10" /> },
    { name: "sur place", key: "onSite", icon: <Store className="size-10" /> },
  ];
  const [validateOrder, { loading }] = useMutation(gql(VALIDATE_CART));
  const navigate = useNavigate();
  const { data: storeData } = useQuery(gql(GET_STORE_BY_ID), {
    variables: { param: "1" },
  });
  const store = storeData?.getStoreById;
  const isRequired = paymentType === "card";

  useEffect(() => {
    setCommandTunnelStatus(CommandStatusEnum.onPayment);
  }, []);

  const baseSchema = z.object({
    cardName: createStringSchema({
      minLength: 2,
      minLengthError: "Le nom doit contenir au moins 2 caractères.",
      maxLength: 50,
      maxLengthError: "Le nom doit contenir au plus 50 caractères.",
      regex: nameRegex,
      regexError: "Le format du nom est invalide.",
      required: isRequired,
      requiredError: "Le nom est requis.",
    }),
    cardNumber: createStringSchema({
      minLength: 13,
      minLengthError:
        "Le numéro de carte bancaire doit contenir au minimum 13 chiffres.",
      maxLength: 19,
      maxLengthError:
        "Le numéro de carte bancaire ne peut pas dépasser 19 chiffres.",
      regex: numberRegex,
      regexError: "Le numéro de carte bancaire est invalide.",
      required: isRequired,
      requiredError: "Le numéro de carte bancaire est requis.",
    }),
    expirationDate: createStringSchema({
      minLength: 5,
      minLengthError:
        "La date d'expiration doit contenir au minimum 5 caractères (exemple : 05/25).",
      maxLength: 7,
      maxLengthError: "La date d'expiration ne peut pas dépasser 7 caractères.",
      regex: /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/,
      regexError:
        "Le format de la date d'expiration est invalide (exemple : 05/25).",
      required: isRequired,
      requiredError: "La date d'expiration est requise.",
    }),
    cvv: createStringSchema({
      minLength: 3,
      minLengthError: "Le code de sécurité doit contenir au moins 3 chiffres.",
      maxLength: 4,
      maxLengthError: "Le code de sécurité ne peut pas dépasser 4 chiffres.",
      regex: numberRegex,
      regexError: "Le code de sécurité est invalide.",
      required: isRequired,
      requiredError: "Le code de sécurité (CVV) est requis.",
    }),
  });

  const cartPaymentSchema = isRequired ? baseSchema : baseSchema.partial();

  type cartPaymentValues = z.infer<typeof cartPaymentSchema>;
  const form = useForm<cartPaymentValues>({
    resolver: zodResolver(cartPaymentSchema),
  });

  const onSubmit = async (data: cartPaymentValues) => {
    if (!cart?.address1) {
      toast.error("L'adresse est requise pour valider votre commande.");
      return navigate("/cart/checkout");
    }
    try {
      const response = await validateOrder({
        variables: {
          data: {
            paymentMethod: paymentType,
          },
        },
      });
      // TODO : pour le moment les informations de la carte de payment ne sont pas envoyés,
      // voir comment stripe marche pour savoir quels infos envoyés

      deleteOrderItemStore();
      updateCartStore({
        address1: null,
        address2: null,
        city: null,
        zipCode: null,
        country: null,
      });

      const ref = response.data.validateCartUser.reference;
      navigate(`/cart/recap/${ref}`);
    } catch (err) {
      console.error("Un problème est survenu : ", err);
      toast.error("un problème est survenu lors du paiement");
    }
  };

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
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                    {""}
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
              <>
                <StringInput
                  form={form}
                  name="cardName"
                  label="Nom sur la carte"
                  placeholder="John Doe"
                  isPending={loading}
                  required
                />
                <StringInput
                  form={form}
                  name="cardNumber"
                  label="Numéro de carte bancaire"
                  placeholder="1234 5678 9010 1112"
                  isPending={loading}
                  required
                />
                <div className="flex flex-wrap w-full gap-2">
                  <StringInput
                    form={form}
                    name="expirationDate"
                    label="Date d'expiration"
                    placeholder="MM/YY"
                    isPending={loading}
                    required
                    containerClassName="w-[calc(50%-0.25rem)]"
                  />
                  <StringInput
                    form={form}
                    name="cvv"
                    label="CVV"
                    placeholder="123"
                    isPending={loading}
                    required
                    containerClassName="w-[calc(50%-0.25rem)]"
                  />
                </div>
              </>
            )}
          </form>
        </FormProvider>
      </section>
    </div>
  );
}
