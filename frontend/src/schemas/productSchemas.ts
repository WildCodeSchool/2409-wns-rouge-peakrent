import { Product as ProductType, Variant as VariantType } from "@/gql/graphql";
import { z } from "zod";
import {
  createBooleanSchema,
  createNumberSchema,
  createStringSchema,
} from "./utils";

const variantCreateSchema = () =>
  z.object({
    size: createStringSchema({
      required: false,
      minLength: 1,
      maxLength: 50,
    })
      .nullable()
      .transform((v) => (v === null ? undefined : v)),
    color: createStringSchema({
      required: false,
      minLength: 1,
      maxLength: 50,
    })
      .nullable()
      .transform((v) => (v === null ? undefined : v)),
    pricePerDay: createNumberSchema({
      required: true,
      min: 0,
      requiredError: "Le prix par jour est requis",
      minError: "Le prix par jour doit être positif",
    }),
    id: z.string().optional(),
  });

export const productFormSchema = (datas?: ProductType | null) =>
  z
    .object({
      name: createStringSchema({
        minLength: 2,
        maxLength: 100,
        defaultValue: datas?.name,
        requiredError: "Le nom est requis",
        invalidFormatError: "Le nom est invalide",
        minLengthError: "Le nom doit contenir au moins 2 caractères",
        maxLengthError: "Le nom doit contenir au plus 100 caractères",
      }),
      description: createStringSchema({
        minLength: 10,
        maxLength: 2000,
        defaultValue: datas?.description || null,
        required: false,
        invalidFormatError: "La description est invalide",
        minLengthError: "La description doit contenir au moins 10 caractères",
        maxLengthError: "La description doit contenir au plus 2000 caractères",
      }),
      sku: createStringSchema({
        minLength: 1,
        maxLength: 100,
        defaultValue: datas?.sku,
        requiredError: "Le SKU est requis",
        invalidFormatError: "Le SKU est invalide",
      }),
      urlImage: createStringSchema({
        maxLength: Infinity,
        defaultValue: (datas as any)?.urlImage || null,
        required: false,
        invalidFormatError: "L'URL de l'image est invalide",
      }),
      image: z.instanceof(File).nullable().default(null),
      removeImage: z.boolean().default(false),
      isPublished: createBooleanSchema({
        required: false,
        defaultValue: Boolean((datas as any)?.isPublished ?? true),
      }),
      categories: z
        .array(z.number().int().positive())
        .default((datas?.categories || []).map((c) => Number(c.id))),
      activities: z
        .array(z.number().int().positive())
        .default((datas?.activities || []).map((a) => Number(a.id))),
      variants: z.array(variantCreateSchema()).default(
        (datas?.variants || []).map((v: VariantType) => ({
          id: String(v.id),
          size: (v.size as string | null) ?? null,
          color: (v.color as string | null) ?? null,
          pricePerDay: Number(v.pricePerDay ?? 0),
        }))
      ),
      id: z.coerce.number().int().positive().optional(),
    })
    .refine(
      (data) => {
        const hasFile = data.image instanceof File;
        const hasUrl =
          typeof data.urlImage === "string" && data.urlImage.trim() !== "";
        return data.removeImage || hasFile || hasUrl;
      },
      {
        message: "Une image ou une URL est requise",
        path: ["urlImage"],
      }
    );

export type ProductFormSchema = z.infer<ReturnType<typeof productFormSchema>>;
