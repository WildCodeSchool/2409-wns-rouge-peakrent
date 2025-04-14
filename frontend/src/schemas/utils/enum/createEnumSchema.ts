import { z } from "zod";

export const createEnumSchema = <T extends string>(
  enums: T[],
  required_error: string = "Field is required",
  invalid_error: string = "Invalid field",
  defaultValue?: T
) => {
  const enumValues = enums.map(String) as [T, ...T[]];

  return z
    .enum(enumValues, {
      required_error,
      message: invalid_error,
    })
    .refine((val) => enumValues.includes(val), {
      message: invalid_error,
    })
    .default(defaultValue ?? enumValues[0]);
};
