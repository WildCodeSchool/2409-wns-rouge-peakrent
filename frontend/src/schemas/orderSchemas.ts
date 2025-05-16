import { z } from "zod";

import { OrderItemStatusType, type Order as OrderType } from "@/gql/graphql";
import {
  createDateSchema,
  createEnumSchema,
  createNumberSchema,
  createStringSchema,
  createZipCodeSchema,
} from "./utils";

export const generateOrderSchema = (datas?: Partial<OrderType>) => {
  return z.object({
    date: createDateSchema().default(() =>
      datas?.createdAt ? new Date(datas?.createdAt) : new Date()
    ),
    profile: createNumberSchema().default(Number(datas?.profile?.id)),
    order_reference_source: createStringSchema(),
    paymentMethod: createStringSchema(),
    address1: createStringSchema({ defaultValue: datas?.address1 ?? "" }),
    address2: createStringSchema({ defaultValue: datas?.address2 ?? "" }),
    country: createStringSchema({ defaultValue: datas?.country ?? "" }),
    zipCode: createZipCodeSchema({ defaultValue: datas?.zipCode ?? "" }),
    city: createStringSchema({ defaultValue: datas?.city ?? "" }),
    phone: createStringSchema({ defaultValue: "" }).optional(),
    orderItems: z
      .array(generateOrderItemSchema())
      .min(1, "Vous devez ajouter au moins un produit à la commande")
      .default(
        datas?.orderItems && datas?.orderItems.length > 0
          ? datas.orderItems.map((item) => ({
              date_range: {
                from: new Date(item.startsAt),
                to: new Date(item.endsAt),
              },
              quantity: item.quantity,
              variant: Number(item.variant?.id),
              status: item.status,
              id: item.id,
            }))
          : []
      ),
  });
};

export type OrderFormSchemaType = z.infer<
  ReturnType<typeof generateOrderSchema>
>;

export const generateOrderItemSchema = () => {
  return z.object({
    date_range: z
      .object(
        {
          from: z.date(),
          to: z.date(),
        },
        {
          required_error: "Please select a date range",
        }
      )
      .refine(
        (data) => {
          if (data.from && data.to && data.from > data.to) {
            return false;
          }
          return true;
        },
        {
          message: "La date de fin doit être après la date de début",
        }
      ),
    // discountPrice: createNumberSchema(),
    quantity: createNumberSchema(),
    product: z.any(),
    // product: z
    //   .object({
    //     id: createNumberSchema(),
    //     name: createStringSchema(),
    //     urlImage: createStringSchema(),
    //     variants: z.array(
    //       z.object({
    //         id: createNumberSchema(),
    //         pricePerHour: createNumberSchema(),
    //         color: createStringSchema(),
    //         size: createStringSchema(),
    //       })
    //     ),
    //   }),
    id: createStringSchema().optional(),
    status: createEnumSchema(
      [
        OrderItemStatusType.Pending,
        OrderItemStatusType.Distributed,
        OrderItemStatusType.Cancelled,
        OrderItemStatusType.Recovered,
        OrderItemStatusType.Refunded,
      ],
      "Le statut est requis"
    ),
    variant: createNumberSchema(),
  });
};

export type OrderItemFormSchemaType = z.infer<
  ReturnType<typeof generateOrderItemSchema>
>;
