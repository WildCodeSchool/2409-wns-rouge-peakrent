import { z } from "zod";

import { createGetMessage } from "../createGetMessage";

interface NumberSchemaOptions {
  dictionnary?: MessagesIntl;
  required?: boolean;
  requiredError?: string;
  min?: number;
  minError?: string;
  max?: number;
  maxError?: string;
  defaultValue?: number;
}

export const createNumberSchema = (options: NumberSchemaOptions = {}) => {
  const {
    dictionnary,
    required = true,
    requiredError = dictionnary ? "required" : "Field is required",
    min = 11,
    minError = dictionnary ? "minError" : `Must be at least ${min}`,
    max = 9999,
    maxError = dictionnary ? "maxError" : `Must not exceed ${max}`,
    defaultValue = 100,
  } = options;

  const getMessage = createGetMessage(dictionnary);

  let schema = z.coerce
    .number({
      required_error: getMessage(requiredError),
    })
    .int();

  schema = schema
    .min(min, getMessage(minError, { min }))
    .max(max, getMessage(maxError, { max }));

  if (!required) {
    schema = schema.optional().nullable() as any;
  }

  schema = schema.default(defaultValue) as any;

  return schema;
};
