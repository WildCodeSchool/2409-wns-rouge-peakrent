import { StringInput } from "@/components/forms/formField";
import { Button } from "@/components/ui/button";
import { nameRegex, numberRegex } from "@/schemas/regex";
import { createStringSchema } from "@/schemas/utils";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Store } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function CartPayment() {
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );
  const [paymentType, setPaymentType] = useState("onSite");
  const PaymentTypeList = [
    { name: "cart", key: "cart", icon: <CreditCard className="size-10" /> },
    { name: "sur place", key: "onSite", icon: <Store className="size-10" /> },
  ];

  setCommandTunnelStatus(CommandStatusEnum.onPayment);
  const cartPaymentSchema = z.object({
    cardName: createStringSchema({
      minLength: 2,
      minLengthError: "Le nom doit contenir au moins 2 caractères.",
      maxLength: 50,
      maxLengthError: "Le nom doit contenir au plus 50 caractères.",
      regex: nameRegex,
      regexError: "Le format du nom est invalide.",
      required: true,
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
      required: true,
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
      required: true,
      requiredError: "La date d'expiration est requise.",
    }),
    cvv: createStringSchema({
      minLength: 3,
      minLengthError: "Le code de sécurité doit contenir au moins 3 chiffres.",
      maxLength: 4,
      maxLengthError: "Le code de sécurité ne peut pas dépasser 4 chiffres.",
      regex: numberRegex,
      regexError: "Le code de sécurité est invalide.",
      required: true,
      requiredError: "Le code de sécurité (CVV) est requis.",
    }),
  });

  type cartPaymentValues = z.infer<typeof cartPaymentSchema>;
  const form = useForm<cartPaymentValues>({
    resolver: zodResolver(cartPaymentSchema),
  });

  const onSubmit = async (data: cartPaymentValues) => {
    // Ajouter le validate Cart
    console.log("test");
  };
  // renvoyer vers page avec reference
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
        {paymentType === "onSite" ? (
          <div className="space-y-4 my-4 p-6 bg-gray-100">
            <div>
              <p>
                Vos articles sont à retirer en magasin à l&apos;adresse suivante
                :
              </p>
              <p>
                123 Rue Exemple, 75000 Paris Du lundi au samedi, de 10h à 19h
              </p>
            </div>
            <p>
              <span className="font-semibold">
                Moyens de paiement acceptés :
              </span>{" "}
              chèque, carte bancaire et espèces.
            </p>
            <p>
              confirmation de commande et une pièce d’identité à présenter lors
              du retrait.
            </p>
          </div>
        ) : (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 my-4 w-full"
              id="payment-form"
            >
              <StringInput
                form={form}
                name="cardName"
                label="Nom sur la carte"
                placeholder="John Doe"
                //   isPending={loading}
                required
              />
              <StringInput
                form={form}
                name="cardNumber"
                label="Numéro de carte bancaire"
                placeholder="1234 5678 9010 1112"
                //   isPending={loading}
                required
              />
              <div className="flex flex-wrap gap-2 w-full">
                <StringInput
                  form={form}
                  name="expirationDate"
                  label="Date d'expiration"
                  placeholder="MM/YY"
                  //   isPending={loading}
                  required
                  className="w-full"
                />
                <StringInput
                  form={form}
                  name="cvv"
                  label="CVV"
                  placeholder="123"
                  //   isPending={loading}
                  required
                  className="w-full"
                />
              </div>
            </form>
          </FormProvider>
        )}
      </section>
    </div>
  );
}
