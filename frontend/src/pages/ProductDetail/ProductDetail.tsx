import { CREATE_ORDER_ITEM } from "@/GraphQL/orderItems";
import { GET_VARIANT_QUANTITY_AVAILABLE } from "@/GraphQL/storeVariant";
import { QuantityInputForm } from "@/components/forms/formField";
import { DateRangePickerInput } from "@/components/forms/formField/date/DateRangePickerInput";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { useUser } from "@/context/userProvider";
import { Variant } from "@/gql/graphql";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { GET_PRODUCT_BY_ID } from "../../GraphQL/products";

const ProductDetail = () => {
  const {
    user: useUserData,
    profile: useUserProfile,
    loading: useUserLoading,
    error: useUserError,
  } = useUser();
  const params = useParams();
  const [selectedVariantsPrice, setSelectedVariantsPrice] = useState<number>(0);
  const [createOrderItem] = useMutation(gql(CREATE_ORDER_ITEM));
  const [checkVariantQuantity] = useLazyQuery(
    gql(GET_VARIANT_QUANTITY_AVAILABLE)
  );

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
    variants: z
      .array(z.any())
      .nonempty("Vous devez selectionner au moins un item"),
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

  const numberOfDays =
    (new Date(selectedEndingDate).getTime() -
      new Date(selectedStartingDate).getTime()) /
    (1000 * 60 * 60 * 24);

  if (getProductError) {
    console.log(getProductError);
    return <div>Impossible de charger l&apos;annonce.</div>;
  }
  const errors = form.formState.errors;

  const checkAvailability = async () => {
    try {
      if (!isDisabled) {
        for (const variant of watchedVariants) {
          const { data } = await checkVariantQuantity({
            variables: {
              storeId: 1,
              variantId: Number(variant.id),
              startingDate: new Date(selectedStartingDate),
              endingDate: new Date(selectedEndingDate),
            },
          });

          const available = data?.checkVariantStock ?? 0;

          if (available - watchedQuantity < 0) {
            toast.error(
              `Quantité indisponible pour le produit ${variant.size}, ${variant.color}`
            );
            console.log("Quantité indisponible pour le variant", variant.id);
            return false;
          }
        }
        return true;
      }
    } catch (err) {
      toast.error(`Une erreur s'est produite`);
      console.error("Erreur vérification disponibilité :", err);
    }
  };

  const onSubmit = async (data: productDetailsSchemaValues) => {
    if (await checkAvailability()) {
      try {
        for (const variant of data.variants) {
          await createOrderItem({
            variables: {
              data: {
                profileId: Number(useUserProfile?.id),
                variantId: Number(variant.id),
                quantity: data.quantity,
                pricePerHour: Number(variant.pricePerHour),
                startsAt: new Date(data.date.from),
                endsAt: new Date(data.date.to),
              },
            },
          });
        }
        console.log("Produits ajoutés au panier !");
      } catch (err) {
        console.error("Erreur ajout panier :", err);
      }
    }
  };

  const handleCheckboxAction = (variant: Variant) => {
    const currentValue = form.getValues("variants") || [];
    const isAlreadySelected = currentValue.some((v) => v.id === variant.id);

    if (isAlreadySelected) {
      setSelectedVariantsPrice(selectedVariantsPrice - variant.pricePerHour);
      form.setValue(
        "variants",
        currentValue.filter((v) => v.id !== (variant.id as any)) as any
      );
    } else {
      setSelectedVariantsPrice(selectedVariantsPrice + variant.pricePerHour);
      form.setValue("variants", [...currentValue, variant]);
    }
  };

  return getProductLoading || useUserLoading ? (
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
                                {(Number(variant.pricePerHour) / 100).toFixed(
                                  2
                                )}{" "}
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
                <QuantityInputForm form={form} min={1} label="Quantité" />
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
                {!useUserData?.id
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
