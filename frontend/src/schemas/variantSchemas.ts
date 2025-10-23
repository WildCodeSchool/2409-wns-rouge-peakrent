import { VariantWithQuantityType } from "@/types";
import { z } from "zod";
import {
  createArraySchema,
  createBooleanSchema,
  createNumberSchema,
  createStringSchema,
} from "./utils";

export const variantCreateSchema = (datas?: Partial<VariantWithQuantityType>) =>
  z.object({
    sizes: createArraySchema(
      createStringSchema({
        required: false,
        minLength: 1,
        maxLength: 50,
      }),
      0,
      50,
      "La taille est requise"
    ).default(datas?.size ? [datas.size] : []),
    quantity: createNumberSchema({
      requiredError: "Veuillez indiquer une quantité.",
      invalidTypeError: "Veuillez saisir une valeur numérique valide.",
      min: 0,
      minError: "La quantité doit être positive",
      defaultValue: datas?.quantity ?? 100,
    }),
    reference: createStringSchema({
      required: false,
    }),
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
