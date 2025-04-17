import { z } from "zod";

import { createGetMessage } from "../createGetMessage";

interface BooleanSchemaOptions {
  dictionnary?: MessagesIntl;
  required?: boolean;
  requiredError?: string;
  defaultValue?: boolean;
}

export const createBooleanSchema = (options: BooleanSchemaOptions = {}) => {
  const {
    dictionnary,
    required = true,
    requiredError = dictionnary ? "required" : "Field is required",
    defaultValue = false,
  } = options;

  const getMessage = createGetMessage(dictionnary);

  let schema = z.boolean().default(defaultValue);

  if (required) {
    schema = schema.refine((value) => value, {
      message: getMessage(requiredError),
    }) as any;
  }

  return schema;
};
