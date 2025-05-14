import { Activity as ActivityType } from "@/gql/graphql";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { z } from "zod";
import { createEnumSchema, createStringSchema } from "./utils";

export const activityBaseSchema = (
  datas?: ActivityType & { images?: File[] }
) =>
  z
    .object({
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
        maxLength: Infinity,
        invalidFormatError: "L'url de l'image est invalide",
        defaultValue: datas?.urlImage,
        required: false,
      }),
      image: z
        .array(
          z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "La taille de l'image doit être inférieure à 10MB",
          })
        )
        .max(1, "Une seule image est requise")
        .nullable()
        .default(datas?.images || null),
      id: z.coerce
        .number()
        .int()
        .positive()
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
    })
    .refine(
      (data) => {
        const hasImage = Array.isArray(data.image) && data.image.length > 0;
        const hasUrlImage = !!data.urlImage && data.urlImage.trim() !== "";
        return hasImage || hasUrlImage;
      },
      {
        path: ["image"],
        message: "Une image ou une URL d'image est requise",
      }
    );

export const activitySchema = (datas?: ActivityType & { images?: File[] }) =>
  activityBaseSchema(datas);

export type ActivitySchemaType = z.infer<ReturnType<typeof activitySchema>>;
