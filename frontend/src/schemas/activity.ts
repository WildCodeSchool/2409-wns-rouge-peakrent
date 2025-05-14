import { Activity as ActivityType } from "@/gql/graphql";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { z } from "zod";
import { createEnumSchema, createStringSchema } from "./utils";

export const activityBaseSchema = (datas?: ActivityType) =>
  z.object({
    name: createStringSchema({
      minLength: 2,
      maxLength: 50,
      defaultValue: datas?.name,
      requiredError: "Le nom est requis",
      invalidFormatError: "Le nom est invalide",
      minLengthError: "Le nom doit contenir au moins 2 caractères",
      maxLengthError: "Le nom doit contenir au plus 50 caractères",
    }),
    variant: createEnumSchema(
      getBadgeVariantOptions().map((option) => option.value),
      "Le badge est requis",
      "Badge invalide",
      datas?.variant || "default"
    ),
    urlImage: createStringSchema({
      minLength: 2,
      maxLength: Infinity,
      requiredError: "L'url de l'image est requis",
      invalidFormatError: "L'url de l'image est invalide",
      minLengthError: "L'url de l'image doit contenir au moins 2 caractères",
      defaultValue: datas?.urlImage,
    }),
    id: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
  });

export const activitySchema = (datas?: ActivityType) =>
  activityBaseSchema(datas);

export type ActivitySchemaType = z.infer<ReturnType<typeof activitySchema>>;
