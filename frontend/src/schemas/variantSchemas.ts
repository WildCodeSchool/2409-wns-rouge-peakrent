import { Variant as VariantType } from "@/gql/graphql";
import { z } from "zod";
import {
  createArraySchema,
  createBooleanSchema,
  createNumberSchema,
  createStringSchema,
} from "./utils";

export const variantCreateSchema = (datas?: VariantType) =>
  z.object({
    sizes: createArraySchema(
      createStringSchema({
        required: false,
        minLength: 1,
        maxLength: 50,
      }),
      0,
      50,
      "Le taille est requis"
    ).default(datas?.size ? [datas.size] : []),
    color: createStringSchema({
      required: false,
      minLength: 1,
      maxLength: 50,
      defaultValue: datas?.color,
    })
      .nullable()
      .transform((v) => (v === null ? undefined : v)),
    pricePerDay: createNumberSchema({
      required: true,
      min: 0,
      requiredError: "Le prix par jour est requis",
      minError: "Le prix par jour doit être positif",
      defaultValue: datas ? (datas.pricePerDay ?? 0) / 100 : 20,
    }),
    isPublished: createBooleanSchema({
      required: false,
      defaultValue: datas?.isPublished ?? true,
    }),
    id: z
      .string()
      .default(datas?.id !== undefined ? String(datas.id) : "")
      .optional(),
  });

export type VariantCreateSchema = z.infer<
  ReturnType<typeof variantCreateSchema>
>;
