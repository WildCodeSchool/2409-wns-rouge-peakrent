import { z } from "zod";

export const createArraySchema = <T extends z.ZodTypeAny>(
  schema: T,
  min: number = 0,
  max: number = 3,
  requiredError: string = "Field is required",
  defaultValue: T[] = []
) =>
  z
    .array(schema, {
      required_error: requiredError,
    })
    .min(min)
    .max(max)
    .default(defaultValue);
