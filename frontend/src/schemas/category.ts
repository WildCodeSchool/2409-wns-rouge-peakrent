import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { z } from "zod";
import { createEnumSchema, createStringSchema } from "./utils";

export const categoryBaseSchema = (
  defaultName?: string,
  defaultColor?: string
) =>
  z.object({
    name: createStringSchema({
      minLength: 2,
      maxLength: 50,
      defaultValue: defaultName,
      requiredError: "Le nom est requis",
      invalidFormatError: "Le nom est invalide",
      minLengthError: "Le nom doit contenir au moins 2 caractères",
      maxLengthError: "Le nom doit contenir au plus 50 caractères",
    }),
    variant: createEnumSchema(
      getBadgeVariantOptions().map((option) => option.value),
      "Le badge est requis",
      "Badge invalide",
      defaultColor || "default"
    ),
  });

export const categoryWithChildrenSchema = (datas?: any) =>
  z.object({
    ...categoryBaseSchema(datas?.name, datas?.color).shape,
    subCategories: z
      .array(categoryBaseSchema())
      .default(
        datas?.childrens && datas?.childrens.length > 0 ? datas?.childrens : []
      ),
  });

export type CategoryBaseSchema = z.infer<ReturnType<typeof categoryBaseSchema>>;
export type CategoryWithChildrenSchema = z.infer<
  ReturnType<typeof categoryWithChildrenSchema>
>;
