import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  DateSinglePicker,
  MultipleSelectorInput,
  StringInput,
} from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { Order as OrderType } from "@/gql/graphql";
import {
  generateOrderSchema,
  OrderFormSchemaType,
} from "@/schemas/orderSchemas";
import { useOrderStore } from "@/stores/admin/order.store";

export function OrderForm({ orderInfos }: { orderInfos?: OrderType }) {
  const [isPending, startTransition] = useTransition();
  const [defaultProfileInfos, setDefaultProfileInfos] = useState<{
    id: number;
    email: string | null;
  } | null>(null);

  const orderItems = useOrderStore((state) => state.orderItemsForm);
  const setOrderItems = useOrderStore((state) => state.setOrderItemsForm);
  const defaultOrderItems = useOrderStore(
    (state) => state.defaultOrderItemsForm
  );

  const formSchema = generateOrderSchema({
    ...orderInfos,
    orderItems: defaultOrderItems ?? [],
  });
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<OrderFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const { errors } = form.formState;

  const orderItemsErrors = errors.orderItems?.message;

  // const orderItemsErrors = errors.orderItems?.message;

  async function onSubmit(values: OrderFormSchemaType) {
    console.log(values);
  }

  async function handleReset() {
    form.reset(defaultValues);
    setDefaultProfileInfos(
      defaultProfileInfos ? { ...defaultProfileInfos } : null
    );
    setOrderItems(defaultOrderItems || []);
  }

  useEffect(() => {
    const updatedOrderItems = orderItems
      ? orderItems.map((item) => ({
          date_range: {
            from: new Date(item.startsAt),
            to: new Date(item.endsAt),
          },
          quantity: item.quantity,
          variant: Number(item.variant?.id),
          status: item.status,
          id: item.id,
          pricePerHour: item.pricePerHour,
        }))
      : [];
    form.setValue("orderItems", updatedOrderItems);
  }, [orderItems, form]);

  // useEffect(() => {
  //   const fetchDefaultCustomer = async () => {
  //     if (orderInfos) {
  //       const { success, data, message } = await getUsersById(
  //         orderInfos.customer_id!
  //       );
  //       if (success && data) {
  //         setDefaultCustomerInfos({ id: data.id, email: data.email });
  //       } else {
  //         console.error(message);
  //         toast.error("Erreur lors de la récupération du client:" + message);
  //       }
  //     }
  //   };
  //   fetchDefaultCustomer();
  // }, [orderInfos]);

  return (
    <Card className="my-4 p-0 col-span-4 xl:col-span-3 py-4">
      <CardHeader>
        <CardTitle className="text-md">Informations de la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
            autoComplete="off"
          >
            <DateSinglePicker
              form={form.control}
              name="date"
              label="Date de la commande"
              required
              placeholder="Choisir une date"
              isPending={isPending}
              locale="fr"
              fromYear={2015}
            />

            {/* <AsyncComboboxInput
              form={form}
              name="customer"
              label="Client"
              placeholder="Choisir un client"
              defaultSelected={defaultCustomerInfos ?? undefined}
              fetchResults={(query) => getUsersByEmail(query)}
              renderItem={(customer) => (
                <div className={cn("flex w-full items-center gap-1")}>
                  {customer?.email}
                </div>
              )}
              isPending={isPending}
              required
              skeletonItems={
                <>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="my-1 h-8 w-full" />
                  ))}
                </>
              }
            /> */}

            {/*<DynamicComboboxInput
              label="Store"
              options={[]}
              form={form}
              name="store"
              isPending={isPending}
              placeholder="Choisir un magasin"
              badgeVariant="yellow"
            /> */}

            <StringInput
              form={form}
              name="order_reference"
              label="Référence de la commande"
              placeholder=""
              isPending={isPending}
              required={false}
            />

            <MultipleSelectorInput
              form={form}
              name="paymentMethod"
              label="Mode de paiement"
              options={[]}
              isPending={isPending}
              placeholder="Choisir un mode de paiement"
              maxCount={1}
              maxSelections={1}
            />

            <Separator />
            <span className="text-md block font-semibold tracking-tight">
              Adresse
            </span>

            <StringInput
              form={form}
              name="address1"
              label="Adresse"
              placeholder=""
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="address2"
              label="Complément d'adresse"
              placeholder=""
              isPending={isPending}
            />

            {/* <CountryInput
                form={form}
                name="address_country"
                label="Pays"
                isPending={isPending}
                required
              /> */}

            <StringInput
              form={form}
              name="zipCode"
              label="Code postal"
              placeholder=""
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="city"
              label="Ville"
              placeholder=""
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="phone"
              label="Téléphone"
              placeholder=""
              isPending={isPending}
            />

            <div className="ml-auto w-[300px]">
              <div className="flex w-full justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="w-full"
                  onClick={handleReset}
                >
                  Réinitialiser
                </Button>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <LoadIcon size={24} />
                  ) : orderInfos ? (
                    "Modifier"
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </div>
            </div>

            {/* {orderItemsErrors && (
              <div className="text-destructive font-medium">
                {orderItemsErrors}
              </div>
              )} */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
