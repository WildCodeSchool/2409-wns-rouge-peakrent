import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { z } from "zod";
import { createEnumSchema, createStringSchema } from "./utils";

export const activityBaseSchema = (
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
    urlImage: createStringSchema({
      requiredError: "L'url de l'image est requis",
      invalidFormatError: "L'url de l'image est invalide",
    }),
    id: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
  });

export const activitySchema = (datas?: any) =>
  activityBaseSchema(datas?.name, datas?.variant);

export type ActivitySchemaType = z.infer<ReturnType<typeof activitySchema>>;
