import { StringInput } from "@/components/forms/formField";
import { UPDATE_CART_USER } from "@/GraphQL/carts";
import {
  addressRegex,
  cityRegex,
  letterRegex,
  zipCodeRegex,
} from "@/schemas/regex";
import { createStringSchema } from "@/schemas/utils";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export function CartCheckout() {
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );
  const cart = useCartStoreUser((state) => state.cart);
  const updateCartStore = useCartStoreUser((state) => state.updateCart);
  const setCart = useCartStoreUser((state) => state.setCart);

  const navigate = useNavigate();

  useEffect(() => {
    setCommandTunnelStatus(CommandStatusEnum.validated);
  }, []);

  const [updateCart, { loading }] = useMutation(gql(UPDATE_CART_USER));
  // TODO : API Avec la liste des pays / Ville ? A ajouter ici + dans resolver pour check ?
  const cartCheckoutSchema = z.object({
    address1: createStringSchema({
      minLength: 1,
      minLengthError: "L'adresse doit contenir au moins 1 caractère",
      maxLength: 255,
      maxLengthError: "L'adresse doit contenir au plus 255 caractères",
      regex: addressRegex,
      regexError: "Format de l'adresse invalide",
      required: true,
      requiredError: "L'adresse est requise",
    }),
    address2: createStringSchema({
      minLength: 1,
      minLengthError: "L'adresse 2 doit contenir au moins 1 caractère",
      maxLength: 255,
      maxLengthError: "L'adresse 2 doit contenir au plus 255 caractères",
      required: false,
    }),
    zipCode: createStringSchema({
      minLength: 1,
      minLengthError: "Le code postale doit contenir au moins 1 caractère",
      maxLength: 20,
      maxLengthError: "Le code postale doit contenir au plus 20 caractères",
      regex: zipCodeRegex,
      regexError: "Format du code postale invalide",
      required: true,
      requiredError: "Le code postale est requis",
    }),
    city: createStringSchema({
      minLength: 1,
      minLengthError: "La ville doit contenir au moins 1 caractère",
      maxLength: 100,
      maxLengthError: "La ville doit contenir au plus 100 caractères",
      regex: cityRegex,
      regexError: "Format de la ville invalide",
      required: true,
      requiredError: "La ville est requise",
    }),
    country: createStringSchema({
      minLength: 1,
      minLengthError: "Le pays doit contenir au moins 1 caractère",
      maxLength: 100,
      maxLengthError: "Le pays doit contenir au plus 100 caractères",
      regex: letterRegex,
      regexError: "Format du pays invalide",
      required: true,
      requiredError: "Le pays est requis",
    }),
  });

  type CartCheckoutValues = z.infer<typeof cartCheckoutSchema>;
  const form = useForm<CartCheckoutValues>({
    resolver: zodResolver(cartCheckoutSchema),
    defaultValues: {
      address1: cart?.address1 ?? "",
      address2: cart?.address2 ?? "",
      country: cart?.country ?? "",
      city: cart?.city ?? "",
      zipCode: cart?.zipCode ?? "",
    },
  });

  const onSubmit = async (data: CartCheckoutValues) => {
    const { address1, address2, city, country, zipCode } = data;

    try {
      const response = await updateCart({
        variables: {
          data: {
            address1,
            address2,
            city,
            country,
            zipCode,
          },
        },
      });
      setCommandTunnelStatus(CommandStatusEnum.onPayment);
      cart
        ? updateCartStore(response.data.updateCart)
        : setCart(response.data.updateCart);
      navigate("/cart/checkout/payment");
    } catch (err) {
      console.error("Un problème est survenu : ", err);
      toast.error("un problème est survenu lors de la mise à jour du panier");
    }
  };

  return (
    <div className="w-full">
      <section>
        <h2>Information de l&apos;adresse</h2>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 my-4 w-full"
            id="checkout-form"
          >
            <StringInput
              form={form}
              name="address1"
              label="Adresse 1"
              placeholder="Votre Adresse"
              isPending={loading}
              required
            />
            <StringInput
              form={form}
              name="address2"
              label="Complément d'adresse"
              placeholder="Complément d'adresse"
              isPending={loading}
            />
            <StringInput
              form={form}
              name="zipCode"
              label="Code postale"
              placeholder="ex : 84000"
              isPending={loading}
              required
            />{" "}
            <StringInput
              form={form}
              name="city"
              label="Ville"
              placeholder="ex : Avignon"
              isPending={loading}
              required
            />
            <StringInput
              form={form}
              name="country"
              label="Pays"
              placeholder="ex : France"
              isPending={loading}
              required
            />
          </form>
        </FormProvider>
      </section>
    </div>
  );
}
