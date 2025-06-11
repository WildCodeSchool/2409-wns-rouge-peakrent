import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  AsyncComboboxInput,
  DateSinglePicker,
  SingleSelectorInput,
  StringInput,
} from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { Skeleton } from "@/components/ui/skeleton";
import { Order as OrderType, Profile as ProfileType } from "@/gql/graphql";
import { CREATE_ORDER_WITH_ITEMS } from "@/GraphQL/order";
import { GET_PROFILE_BY_USER_ID, GET_PROFILES } from "@/GraphQL/profiles";
import { cn } from "@/lib/utils";
import {
  generateOrderSchema,
  OrderFormSchemaType,
} from "@/schemas/orderSchemas";
import {
  addOrderStore,
  updateOrderStore,
  useOrderStore,
} from "@/stores/admin/order.store";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";

export function OrderForm({ orderInfos }: { orderInfos?: OrderType }) {
  const [isPending, setIsPending] = useState(false);
  const [defaultCustomerInfos, setDefaultCustomerInfos] =
    useState<ProfileType | null>(null);

  // store variables + functions
  const orderItems = useOrderStore((state) => state.orderItemsForm);
  const setOrderItems = useOrderStore((state) => state.setOrderItemsForm);
  const defaultOrderItems = useOrderStore(
    (state) => state.defaultOrderItemsForm
  );
  const ordersFetched = useOrderStore((state) => state.ordersFetched);

  // gql queries
  const [fetchCustomers] = useLazyQuery(gql(GET_PROFILES), {
    onCompleted: (data) => {
      return data?.getProfiles ?? [];
    },
  });

  const [fetchDefaultCustomer] = useLazyQuery(gql(GET_PROFILE_BY_USER_ID), {
    onCompleted: (data) => {
      return data?.getProfileByUserId ?? [];
    },
  });

  const [createOrder] = useMutation(gql(CREATE_ORDER_WITH_ITEMS), {
    onCompleted: (data) => {
      return data?.createOrderWithItems ?? null;
    },
  });

  // form initialization + default values
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

  // form functions
  async function onSubmit(values: OrderFormSchemaType) {
    setIsPending(true);
    try {
      const { data, errors } = await createOrder({
        variables: {
          data: {
            profileId: values.customer,
            reference: values.reference,
            paymentMethod: values.paymentMethod,
            address1: values.address1,
            address2: values.address2,
            country: values.country,
            city: values.city,
            zipCode: values.zipCode,
            paidAt: null,
            phone: values.phone,
            date: values.date,
          },
          items: values.orderItems.map((item) => ({
            ...item,
            product: undefined,
            id: undefined,
          })),
        },
      });
      if (errors) {
        toast.error("Erreur lors de la création de la commande:" + errors);
        return;
      }
      if (data) {
        toast.success("Commande créée avec succès");
        //TODO verify for the update order
        orderInfos
          ? updateOrderStore(orderInfos.id, data)
          : addOrderStore(data);
        handleReset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la commande:" + error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleReset() {
    form.reset(defaultValues);
    setDefaultCustomerInfos(
      defaultCustomerInfos ? { ...defaultCustomerInfos } : null
    );
    setOrderItems(defaultOrderItems || []);
  }

  // update order items on orderItems change
  useEffect(() => {
    const updatedOrderItems = orderItems
      ? orderItems.map((item) => ({
          date_range: {
            from: new Date(item.startsAt),
            to: new Date(item.endsAt),
          },
          product: true,
          quantity: item.quantity,
          variant: Number(item.variant?.id),
          status: item.status,
          id: item.id,
          pricePerHour: item.pricePerHour,
        }))
      : [];
    form.setValue("orderItems", updatedOrderItems);
  }, [orderItems, form]);

  // fetch default customer on mount if orderInfos is provided
  useEffect(() => {
    const fetchCustomer = async () => {
      if (orderInfos) {
        const { success, data, message } = await fetchDefaultCustomer({
          variables: { userId: orderInfos.id },
        }).then((res) => {
          return {
            success: res.data?.getProfileByUserId?.id,
            data: res.data?.getProfileByUserId,
            message: "",
          };
        });
        if (success && data) {
          setDefaultCustomerInfos(data);
        } else {
          console.error(message);
          toast.error("Erreur lors de la récupération du client:" + message);
        }
      }
    };
    fetchCustomer();
  }, []);

  return (
    <Card className="my-4 p-0 md:col-span-4 xl:col-span-3 py-4">
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

            <AsyncComboboxInput
              form={form}
              name="customer"
              label="Client"
              placeholder="Choisir un client"
              defaultSelected={defaultCustomerInfos ?? undefined}
              fetchResults={(query) =>
                fetchCustomers({ variables: { search: query } }).then((res) => {
                  return {
                    success: res.data?.getProfiles?.length > 0,
                    message:
                      res.data?.getProfiles?.length > 0
                        ? "Client trouvé"
                        : "Aucun client trouvé",
                    data: res.data?.getProfiles ?? [],
                  };
                })
              }
              renderItem={(customer: ProfileType) => (
                <div className={cn("flex w-full items-center gap-1")}>
                  <span className="normal-case">
                    {customer?.firstname} {customer?.lastname}
                  </span>
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
            />

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
              name="reference"
              label="Référence de la commande"
              placeholder="..."
              isPending={isPending}
              required={false}
            />

            <SingleSelectorInput
              form={form}
              name="paymentMethod"
              label="Moyen de paiement"
              placeholder="Choisir le paiement"
              options={[{ label: "Carte bancaire", value: "card" }]}
              isPending={isPending}
              columns={1}
              required
            />

            <Separator />
            <span className="text-md block font-semibold tracking-tight">
              Adresse
            </span>

            <StringInput
              form={form}
              name="address1"
              label="Adresse"
              placeholder="..."
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="address2"
              label="Complément d'adresse"
              placeholder="..."
              isPending={isPending}
            />

            <StringInput
              form={form}
              name="country"
              label="Pays"
              placeholder="..."
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="zipCode"
              label="Code postal"
              placeholder="..."
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="city"
              label="Ville"
              placeholder="..."
              isPending={isPending}
              required
            />

            <StringInput
              form={form}
              name="phone"
              label="Téléphone"
              placeholder="..."
              isPending={isPending}
            />

            <div className="ml-auto flex w-full justify-between gap-2 pt-2 max-w-[300px]">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="flex-1"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <LoadIcon size={24} />
                ) : orderInfos ? (
                  "Modifier"
                ) : (
                  "Ajouter"
                )}
              </Button>
            </div>

            {orderItemsErrors && (
              <div className="text-destructive font-medium">
                {orderItemsErrors}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
