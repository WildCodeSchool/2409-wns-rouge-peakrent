import { z } from "zod";

import { createGetMessage } from "../createGetMessage";

interface DateSchemaOptions {
  dictionnary?: MessagesIntl;
  required?: boolean;
  requiredError?: string;
  minDate?: Date;
  minDateError?: string;
  maxDate?: Date;
  maxDateError?: string;
}

export const createDateSchema = (
  options: DateSchemaOptions = {}
): z.ZodType<Date> => {
  const {
    dictionnary,
    required = true,
    requiredError = dictionnary ? "required" : "Field is required",
    minDate,
    minDateError = dictionnary
      ? "minDateError"
      : `Date must be after ${minDate}`,
    maxDate,
    maxDateError = dictionnary
      ? "maxDateError"
      : `Date must be before ${maxDate}`,
  } = options;

  const getMessage = createGetMessage(dictionnary);

  let schema = z.coerce.date({
    required_error: getMessage(requiredError),
  });

  if (minDate) {
    schema = schema.min(minDate, {
      message: getMessage(minDateError, { minDate }),
    });
  }

  if (maxDate) {
    schema = schema.max(maxDate, {
      message: getMessage(maxDateError, { maxDate }),
    });
  }

  if (!required) {
    schema = schema.optional().nullable() as any;
  }

  return schema;
};
