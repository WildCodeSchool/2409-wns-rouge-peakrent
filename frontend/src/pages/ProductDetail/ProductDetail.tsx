import { Quantity } from "@/components/forms/formField";
import { DateRangePickerInput } from "@/components/forms/formField/date/DateRangePickerInput";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { useUser } from "@/context/userProvider";
import { Variant } from "@/gql/graphql";
import { CREATE_ORDER_ITEM_USER } from "@/graphQL/orderItems";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { totalDays } from "@/utils/getNumberOfDays";
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { GET_PRODUCT_BY_ID } from "../../graphQL/products";

const ProductDetail = () => {
  const {
    user: userData,
    profile: userProfile,
    loading: userLoading,
    error: userError,
  } = useUser();
  const params = useParams();
  const [selectedVariantsPrice, setSelectedVariantsPrice] = useState<number>(0);
  const [createOrderItem] = useMutation(gql(CREATE_ORDER_ITEM_USER));

  const addOrderItem = useOrderItemStore((state) => state.addOrderItem);

  const {
    data: getProductData,
    loading: getProductLoading,
    error: getProductError,
  } = useQuery(gql(GET_PRODUCT_BY_ID), {
    variables: { param: params.id },
  });

  const product = getProductData?.getProductById;

  const productDetailsSchema = z.object({
    date: z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .refine((data) => data.from && data.to, {
        message: "Veuillez sélectionner une plage de dates complète.",
      }),
    quantity: z.number().min(1),
    variants: z.array(z.object({}).passthrough()).min(1),
  });

  type productDetailsSchemaValues = z.infer<typeof productDetailsSchema>;
  const form = useForm<productDetailsSchemaValues>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      date: { from: undefined, to: undefined },
      quantity: 1,
      variants: [],
    },
  });

  const watchedVariants = form.watch("variants");
  const watchedQuantity = form.watch("quantity");
  const { from: selectedStartingDate, to: selectedEndingDate } =
    form.watch("date") || {};

  const isDisabled =
    !selectedStartingDate ||
    !selectedEndingDate ||
    watchedVariants.length <= 0 ||
    watchedQuantity < 0;

  const numberOfDays = totalDays(selectedStartingDate, selectedEndingDate);

  if (getProductError) {
    return <div>Impossible de charger l&apos;annonce.</div>;
  }

  const onSubmit = async (data: productDetailsSchemaValues) => {
    if (
      selectedStartingDate &&
      selectedEndingDate &&
      new Date(selectedStartingDate).getTime() >
        new Date(selectedEndingDate).getTime()
    ) {
      return toast.error(
        `La date de fin ne peut pas être inférieure à celle de début`
      );
    }
    const unavailableProducts: { size: string; color: string }[] = [];

    for (const variant of data.variants as Variant[]) {
      try {
        const newOrderItem = await createOrderItem({
          variables: {
            data: {
              variantId: Number(variant.id),
              quantity: data.quantity,
              pricePerDay: Number(variant.pricePerDay),
              startsAt: new Date(data.date.from),
              endsAt: new Date(data.date.to),
            },
          },
        });
        addOrderItem(newOrderItem.data.createOrderItems);
      } catch (err: any) {
        const codeError = err.graphQLErrors?.[0]?.extensions?.code;
        if (codeError === "OUT_OF_STOCK") {
          unavailableProducts.push({
            size: variant.size ?? "Inconnu",
            color: variant.color ?? "Inconnu",
          });
        } else {
          console.error("erreur lors de l'ajout au panier :", err);
          toast.error("erreur lors de l'ajout au panier");
        }
      }
    }

    if (unavailableProducts.length !== data.variants.length) {
      toast.success(`Produit(s) ajouté(s) au panier !`);
    }

    if (unavailableProducts.length > 0) {
      unavailableProducts.forEach((p) => {
        toast.error(
          `Quantité indisponible pour le produit : ${p.size}, ${p.color}`
        );
      });
    }
  };

  const handleCheckboxAction = (variant: Variant) => {
    const currentValue = form.getValues("variants") || [];
    const isAlreadySelected = currentValue.some((v) => v.id === variant.id);

    if (isAlreadySelected) {
      setSelectedVariantsPrice(selectedVariantsPrice - variant.pricePerDay);
      form.setValue(
        "variants",
        currentValue.filter((v: Partial<Variant>) => v.id !== variant.id)
      );
    } else {
      setSelectedVariantsPrice(selectedVariantsPrice + variant.pricePerDay);
      form.setValue("variants", [...currentValue, variant]);
    }
  };

  return getProductLoading || userLoading ? (
    <div className="flex items-center justify-center h-screen">
      <LoadIcon size={60} />
    </div>
  ) : (
    <article className="md:p-6">
      <div className="flex gap-1 bg-white p-4 flex-col md:flex-row justify-center items-center md:justify-normal md:justify-items-normal">
        <div className="flex items-center justify-center md:aspect-video w-1/4 md:w-1/2">
          <ImageHandler
            className="h-full w-auto max-h-full object-contain"
            src={product.urlImage}
            alt={product.name}
          />
        </div>
        <div className="md:w-1/2 gap-3">
          <h1 className="text-xl">{product.name}</h1>
          <div className="flex flex-wrap items-center justify-start text-center gap-2 my-2">
            {product.categories.map((category: any) => (
              <p
                className="px-2 py-1 text-white bg-primary rounded text-sm"
                key={category.id}
              >
                {category.name}
              </p>
            ))}
          </div>
          <p className="text-base leading-relaxed">{product.description}</p>

          <p className="text-xl my-5 font-semibold">
            {selectedVariantsPrice
              ? (
                  (Number(selectedVariantsPrice) *
                    watchedQuantity *
                    (numberOfDays || 1)) /
                  100
                ).toFixed(2)
              : 0}{" "}
            €
          </p>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="variants"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-4">
                      {product.variants.map((variant: Variant) => {
                        const isChecked = (
                          field.value as { id: string }[]
                        )?.some((v) => v.id === variant.id);
                        return (
                          <label
                            key={variant.id}
                            htmlFor={variant.id}
                            className="flex items-center gap-4 border rounded-2xl p-4 hover:bg-primary hover:text-white transition duration-200 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              id={variant.id}
                              value={variant.id}
                              checked={isChecked}
                              onChange={(e) => handleCheckboxAction(variant)}
                              className="accent-primary w-5 h-5"
                            />
                            <div className="flex flex-col gap-2">
                              <p>Taille : {variant.size}</p>
                              <p>Couleur : {variant.color}</p>
                              <p className="px-2 py-1 text-white bg-primary rounded text-sm w-fit justify-self-end">
                                {(Number(variant.pricePerDay) / 100).toFixed(2)}{" "}
                                €/J
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
              <div className="flex flex-col my-5 gap-5 max-w-[600px]">
                <Quantity form={form} min={1} label="Quantité" />
                <DateRangePickerInput
                  form={form}
                  from={form.getValues("date").from}
                  to={form.getValues("date").to}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-4 mx-auto mt-6 rounded-lg w-full max-w-[600px] text-xl"
                disabled={isDisabled}
              >
                {!userData?.id
                  ? "Se connecter pour ajouter au panier"
                  : "Ajouter au panier"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </article>
  );
};

export default ProductDetail;
