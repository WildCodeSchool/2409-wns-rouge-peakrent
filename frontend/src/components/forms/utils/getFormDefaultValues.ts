import { DefaultValues } from "react-hook-form";
import { z } from "zod";
import { getDefaultValues, getObjectFormSchema } from "./utils";

export function getFormDefaultValues<T extends z.ZodTypeAny>(
  formSchema: T
): DefaultValues<z.infer<T>> {
  const objectFormSchema = getObjectFormSchema(
    formSchema as unknown as z.ZodObject<any>
  );
  return getDefaultValues(objectFormSchema) as DefaultValues<z.infer<T>>;
}
