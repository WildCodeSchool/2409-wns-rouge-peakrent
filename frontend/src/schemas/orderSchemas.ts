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
    customer: createNumberSchema({
      requiredError: "Le client est requis",
      invalidTypeError: "Le client est requis",
      min: 1,
      minError: "L'id du client est invalide",
      max: Infinity,
      maxError: "L'id du client est invalide",
    }).default(Number(datas?.profile?.id)),
    order_reference_source: createStringSchema({
      required: false,
    }),
    paymentMethod: createStringSchema({
      requiredError: "La méthode de paiement est requise",
    }),
    address1: createStringSchema({
      defaultValue: datas?.address1 ?? "",
      requiredError: "L'adresse est requise",
    }),
    address2: createStringSchema({
      defaultValue: datas?.address2 ?? "",
      required: false,
    }),
    country: createStringSchema({
      defaultValue: datas?.country ?? "",
      requiredError: "Le pays est requis",
    }),
    zipCode: createZipCodeSchema(datas?.zipCode ?? ""),
    city: createStringSchema({
      defaultValue: datas?.city ?? "",
      requiredError: "La ville est requise",
    }),
    phone: createStringSchema({
      defaultValue: "",
      required: false,
    }).optional(),
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
              pricePerHour: item.pricePerHour,
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
          required_error: "Veuillez sélectionner une période",
          invalid_type_error: "Veuillez sélectionner une période",
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
    quantity: createNumberSchema({
      requiredError: "La quantité est requise",
      min: 1,
      max: 99,
      minError: "La quantité doit être supérieure à {min}",
      maxError: "La quantité doit être inférieure à {max}",
      invalidTypeError: "La quantité est requise ou invalide",
      required: true,
    }),
    product: z.any().refine(
      (data) => {
        if (!data) {
          return false;
        }
        return true;
      },
      {
        message: "Le produit est requis",
      }
    ),
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
    pricePerHour: createNumberSchema({
      requiredError: "Le prix par heure est requis",
      min: 0,
      minError: "Le prix par heure doit être supérieur à {min}",
      max: Infinity,
      maxError: "Le prix par heure doit être inférieur à {max}",
      required: true,
    }),
    variant: createNumberSchema({
      requiredError: "Le variant est requis",
      min: 1,
      minError: "L'id du variant est invalide",
      max: Infinity,
      maxError: "L'id du variant est invalide",
      invalidTypeError: "Le variant est requis",
      required: true,
      defaultValue: null,
    }),
  });
};

export type OrderItemFormSchemaType = z.infer<
  ReturnType<typeof generateOrderItemSchema>
>;
