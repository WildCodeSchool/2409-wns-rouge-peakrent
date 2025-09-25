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
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );

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
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];
  const form = useForm<productDetailsSchemaValues>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      date: { from: localToday, to: localToday },
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
    watchedQuantity < 0 ||
    !userData?.id;

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
    if (!userData?.id) {
      return toast.error("Veuillez vous connecter pour ajouter au panier");
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
          console.error("Erreur lors de l'ajout au panier :", err);
          toast.error("Erreur lors de l'ajout au panier");
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

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariantId(Number(variant.id));
    setSelectedVariantsPrice(Number(variant.pricePerDay));
    form.setValue("variants", [variant]);
  };

  return getProductLoading || userLoading ? (
    <div className="flex items-center justify-center h-screen">
      <LoadIcon size={60} />
    </div>
  ) : (
    <article className="md:p-6">
      <section className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 p-4">
          {/* Colonne gauche : visuel & informations */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <ImageHandler
                className="h-full w-auto max-h-[420px] object-contain"
                src={product.urlImage}
                alt={product.name}
              />
            </div>
            {/* Carte blanche avec titre/description */}
            <div className="bg-[#F1F2F4] rounded-xl drop-shadow-xl p-4 md:p-6 flex flex-col gap-3 border border-black/5">
              <h1 className="text-2xl font-semibold tracking-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {product.categories.map((category: any) => (
                  <span
                    className="px-2 py-1 text-white bg-primary rounded text-xs md:text-sm"
                    key={category.id}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <p className="text-sm md:text-base leading-relaxed text-gray-700">
                {product.description}
              </p>
            </div>
          </div>

          {/* Colonne droite : configuration & panier */}
          <div className="md:sticky md:top-6 bg-[#F1F2F4] rounded-xl drop-shadow-xl p-4 md:p-6 flex flex-col gap-6 border border-black/5">
            {/* Configuration */}
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">
                    Choisissez vos options
                  </h2>
                  <p className="text-sm text-gray-600">
                    Sélectionnez une variante correspondant à vos besoins.
                  </p>
                  <FormField
                    control={form.control}
                    name="variants"
                    render={({ field }) => (
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 "
                        role="radiogroup"
                        aria-label="Variantes disponibles"
                      >
                        {product.variants.map((variant: Variant) => {
                          const isChecked =
                            Number(variant.id) === selectedVariantId;
                          return (
                            <label
                              key={variant.id}
                              htmlFor={`variant-${variant.id}`}
                              className={`flex items-center gap-4 border rounded-2xl p-4 transition duration-200 cursor-pointer hover:border-primary ${
                                isChecked
                                  ? "bg-primary text-white border-primary ring-2 ring-primary"
                                  : "bg-white hover:bg-gray-50"
                              } w-full`}
                            >
                              <input
                                type="radio"
                                id={`variant-${variant.id}`}
                                name="variant"
                                value={variant.id}
                                checked={isChecked}
                                onChange={() => handleVariantSelect(variant)}
                                className="accent-primary w-5 h-5"
                                aria-label={`Sélectionner la variante taille ${variant.size} couleur ${variant.color}`}
                              />
                              <div className="flex flex-col gap-1">
                                <p className="text-sm">
                                  Taille : {variant.size}
                                </p>
                                <p className="text-sm">
                                  Couleur : {variant.color}
                                </p>
                                <p
                                  className={`px-2 py-0.5 rounded text-xs w-fit ${
                                    isChecked
                                      ? "bg-white text-primary border border-white/60"
                                      : "bg-primary text-white"
                                  }`}
                                >
                                  {(Number(variant.pricePerDay) / 100).toFixed(
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

                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium">Période & quantité</h2>
                  <p className="text-sm text-gray-600">
                    Indiquez vos dates de location et le nombre d&apos;articles
                    souhaité.
                  </p>
                  <div className="flex flex-col my-2 gap-4 max-w-[600px]">
                    <Quantity
                      form={form}
                      min={1}
                      label="Quantité"
                      inputClassName="bg-white"
                    />
                    <DateRangePickerInput
                      inputClassName="bg-white"
                      form={form}
                      from={form.getValues("date").from}
                      to={form.getValues("date").to}
                    />
                  </div>
                  {selectedStartingDate && selectedEndingDate && (
                    <p className="text-xs text-gray-500">
                      {numberOfDays || 1} jour
                      {(numberOfDays || 1) > 1 ? "s" : ""} sélectionné
                      {(numberOfDays || 1) > 1 ? "s" : ""}.
                    </p>
                  )}
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">Total estimé</p>
                    <p
                      className={
                        selectedVariantsPrice
                          ? "text-3xl font-semibold tracking-tight"
                          : "text-gray-500 italic"
                      }
                    >
                      {selectedVariantsPrice
                        ? (
                            (Number(selectedVariantsPrice) *
                              watchedQuantity *
                              (numberOfDays || 1)) /
                            100
                          ).toFixed(2) + "€"
                        : "Sélectionnez une variante"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Calcul: prix/jour × quantité × {numberOfDays || 1} jour
                    {(numberOfDays || 1) > 1 ? "s" : ""}.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-4 mt-2 rounded-lg w-full max-w-[600px] text-base md:text-lg"
                  disabled={isDisabled}
                >
                  {!userData?.id
                    ? "Se connecter pour ajouter au panier"
                    : "Ajouter au panier"}
                </Button>
                <p className="text-xs text-gray-500">
                  Le total est une estimation. Le prix final est confirmé au
                  panier.
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </section>
    </article>
  );
};

export default ProductDetail;
