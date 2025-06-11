import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import {
  AsyncComboboxInput,
  Price,
  Quantity,
  SingleSelectorInput,
} from "@/components/forms/formField";
import { DateRangePicker } from "@/components/forms/formField/date/DateRangePicker";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import type {
  Product as ProductType,
  Variant as VariantType,
} from "@/gql/graphql";
import { GET_PRODUCT_BY_VARIANT_ID, GET_PRODUCTS } from "@/GraphQL/products";
import { cn } from "@/lib/utils";
import {
  generateOrderItemSchema,
  OrderItemFormSchemaType,
} from "@/schemas/orderSchemas";
import {
  setFormOrderItem,
  updateFormOrderItem,
  useOrderStore,
} from "@/stores/admin/order.store";
import { gql, useLazyQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface VariantWithLabelI extends VariantType {
  label: string;
  value: string;
}

export function OrderItemForm() {
  const [isPending, setIsPending] = useState(false);
  const [variants, setVariants] = useState<VariantWithLabelI[]>([]);
  const [selected, setSelected] = useState<ProductType | undefined>();

  // store variables + functions
  const setOrderItems = useOrderStore((state) => state.setOrderItemsForm);
  const orderItems = useOrderStore((state) => state.orderItemsForm);
  const formOrderItem = useOrderStore((state) => state.formOrderItem);

  // gql queries
  const [getProductByVariantId, { loading: productsByVariantIdLoadingLazy }] =
    useLazyQuery(gql(GET_PRODUCT_BY_VARIANT_ID), {
      onCompleted: (data) => {
        return data?.getProductByVariantId ?? [];
      },
    });

  const [fetchProducts, { loading: productsLoadingLazy }] = useLazyQuery(
    gql(GET_PRODUCTS),
    {
      onCompleted: (data) => {
        return data?.getProducts?.products ?? [];
      },
    }
  );

  // form initialization + default values
  const formSchema = generateOrderItemSchema();

  const defaultEmptyValues = {
    quantity: 1,
    pricePerHour: 100,
    variant: undefined,
    product: undefined,
    date_range: {
      from: new Date(),
      to: (() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
      })(),
    },
  };

  const defaultValues = formOrderItem
    ? {
        quantity: formOrderItem.quantity,
        pricePerHour: formOrderItem.pricePerHour,
        variant: Number(formOrderItem.variant?.id),
        product: formOrderItem.variant?.product,
        date_range: {
          from: formOrderItem.startsAt
            ? new Date(formOrderItem.startsAt)
            : new Date(),
          to: formOrderItem.endsAt
            ? new Date(formOrderItem.endsAt)
            : new Date(),
        },
      }
    : defaultEmptyValues;

  const form = useForm<OrderItemFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const productSelected = form.watch("product");

  // form functions
  const handleCancelUpdate = () => {
    setFormOrderItem(null);
    form.reset(defaultEmptyValues);
  };

  const handleReset = () => {
    if (!formOrderItem) {
      setVariants([]);
      setSelected(undefined);
    }
    form.reset(defaultValues);
  };

  const handleChange = (item: ProductType) => {
    const currentVariants = item.variants?.map((variant) => ({
      ...variant,
      label: variant.size as string,
      value: variant.id,
    }));
    setSelected(item);
    setVariants(currentVariants ?? []);
    form.setValue("variant", 0);
  };

  async function onSubmit(values: OrderItemFormSchemaType) {
    handleReset();
    const selectedVariant = variants.find(
      (variant) => Number(variant.value) === Number(values.variant)
    );
    if (!selectedVariant) {
      toast.error("Veuillez sélectionner une variante");
      return;
    }
    if (formOrderItem) {
      const itemToUpdate = {
        ...formOrderItem,
        ...values,
        startsAt: values.date_range.from,
        endsAt: values.date_range.to,
        variant: selectedVariant
          ? {
              ...selectedVariant,
              product: selected!,
              pricePerHour: values.pricePerHour,
              size: selectedVariant.label,
              id: selectedVariant.id,
            }
          : undefined,
      };
      updateFormOrderItem(itemToUpdate);
      toast.success("Le produit a bien été mis à jour");
      setFormOrderItem(null);
      form.reset(defaultEmptyValues);
    } else {
      const { date_range, ...restValues } = values;
      const itemsToAdd = {
        ...restValues,
        variant: {
          ...selectedVariant,
          product: selected!,
        },
        id: new Date().getTime().toString(),
        createdAt: new Date(),
        updatedAt: null,
        startsAt: values.date_range.from,
        endsAt: values.date_range.to,
      };
      setOrderItems([...(orderItems ?? []), itemsToAdd]);
      toast.success("Les produits ont bien été ajoutés");
    }
  }

  // fetch products
  const handleFetchProducts = async (query: string) => {
    const result = await fetchProducts({
      variables: {
        search: query,
      },
    });

    if (result.data?.getProducts?.products) {
      return {
        success: true,
        message: "Produits récupérés avec succès",
        data: result.data?.getProducts?.products,
      };
    }

    return {
      success: false,
      message: "Aucun produit trouvé",
      data: [],
    };
  };

  // fetch product by variant id on formOrderItem change
  useEffect(() => {
    const getProduct = async () => {
      if (formOrderItem) {
        setIsPending(true);
        form.setValue("product", formOrderItem.variant?.product);
        form.setValue("pricePerHour", formOrderItem.pricePerHour);
        form.setValue("quantity", formOrderItem.quantity);
        form.setValue("date_range", {
          from: formOrderItem.startsAt,
          to: formOrderItem.endsAt,
        });
        const { data } = await getProductByVariantId({
          variables: {
            id: Number(formOrderItem.variant?.id),
          },
        });
        if (
          data &&
          data.getProductByVariantId &&
          data.getProductByVariantId.variants &&
          data.getProductByVariantId.variants.length > 0
        ) {
          setSelected(data.getProductByVariantId);
          form.setValue("variant", Number(formOrderItem.variant?.id));
          setVariants(
            data.getProductByVariantId.variants.map((variant: VariantType) => ({
              ...variant,
              label: variant.size as string,
              value: Number(variant.id),
            }))
          );
        }
        setIsPending(false);
      }
    };
    getProduct();
  }, [formOrderItem]);

  // reset form on unmount
  useEffect(() => {
    return () => {
      setFormOrderItem(null);
      setOrderItems([]);
    };
  }, []);

  return (
    <Card className="my-4 px-0 py-4 md:col-span-6 xl:col-span-7">
      <CardHeader>
        <CardTitle className="text-md">
          {formOrderItem ? "Modifier" : "Ajouter"} un produit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <DateRangePicker
              form={form}
              name="date_range"
              label="Dates de location"
              isPending={isPending}
              fromYear={2020}
              toYear={new Date().getFullYear() + 5}
              disabledDates={(date) => date < new Date("2020-01-01")}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8 mt-4">
              <div className="space-y-4">
                <AsyncComboboxInput
                  form={form}
                  name="product"
                  label="Produit"
                  isPending={isPending || productsLoadingLazy}
                  handleResetField={() => {
                    form.setValue("product", undefined);
                  }}
                  handleChange={handleChange}
                  placeholder="Sélectionner un produit"
                  fetchResults={handleFetchProducts}
                  renderItem={(item: ProductType) => (
                    <div className={cn("flex w-full items-center gap-2")}>
                      {item.urlImage && (
                        <ImageHandler
                          className="size-8 object-cover rounded-md border"
                          width={32}
                          height={32}
                          src={item.urlImage}
                          alt={item.name}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  )}
                  skeletonItems={
                    <>
                      {[...Array(5)].map((_, index) => (
                        <div
                          className={cn(
                            "my-2 flex w-full items-center justify-between gap-1"
                          )}
                          key={index}
                        >
                          <div className="flex w-full items-center gap-4">
                            <Skeleton className="size-4 min-h-4 min-w-4" />
                            <Skeleton className="size-8 min-h-8 min-w-8" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </div>
                      ))}
                    </>
                  }
                />

                <SingleSelectorInput
                  label="Variante"
                  options={variants}
                  form={form}
                  name="variant"
                  handleChange={(value) => {
                    form.setValue(
                      "pricePerHour",
                      (variants.find(
                        (variant) => Number(variant.value) === Number(value)
                      )?.pricePerHour ?? 0) / 100
                    );
                  }}
                  isPending={
                    isPending ||
                    productsByVariantIdLoadingLazy ||
                    productsLoadingLazy ||
                    !productSelected
                  }
                  placeholder="Sélectionner une taille"
                  variant="secondary"
                />
              </div>

              <div className="space-y-4">
                <Quantity
                  form={form}
                  isPending={isPending}
                  containerClassName="border-0 w-full max-w-full p-0 h-fit gap-1"
                  itemClassName="flex-col w-full items-start"
                  label="Quantité"
                  inputClassName="w-full max-w-full h-10"
                  buttonsClassName="bg-primary/70 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 p-2 hover:ring-0 "
                  dozenClassName="bg-primary/90 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 p-2 hover:ring-0 "
                  withDozen
                />

                <Price
                  form={form}
                  isPending={isPending}
                  name="pricePerHour"
                  label="Prix par heure"
                  withCents
                />
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2 ml-auto w-full max-w-[300px]">
              {formOrderItem && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full"
                  onClick={handleCancelUpdate}
                >
                  Annuler
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="w-full"
                onClick={handleReset}
                id="resetOrderItemForm"
              >
                Réinitialiser
              </Button>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <LoadIcon size={24} />
                ) : formOrderItem ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
