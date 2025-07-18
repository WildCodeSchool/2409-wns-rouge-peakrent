import { StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { UPDATE_CART_USER } from "@/graphQL/carts";
import { cartCheckoutSchema, CartCheckoutType } from "@/schemas/cartSchemas";
import { useCartStoreUser } from "@/stores/user/cart.store";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CartCheckout() {
  const cart = useCartStoreUser((state) => state.cart);
  const updateCartStore = useCartStoreUser((state) => state.updateCart);
  const setCart = useCartStoreUser((state) => state.setCart);

  const navigate = useNavigate();

  const [updateCart, { loading }] = useMutation(gql(UPDATE_CART_USER));

  const form = useForm<CartCheckoutType>({
    resolver: zodResolver(cartCheckoutSchema),
    defaultValues: getFormDefaultValues(cartCheckoutSchema),
  });

  const onSubmit = async (data: CartCheckoutType) => {
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
