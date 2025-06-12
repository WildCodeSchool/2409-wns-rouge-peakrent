import { z } from "zod";

import { createGetMessage } from "../createGetMessage";

interface StringSchemaOptions {
  dictionnary?: any;
  required?: boolean;
  requiredError?: string;
  minLength?: number;
  minLengthError?: string;
  maxLength?: number;
  maxLengthError?: string;
  regex?: RegExp;
  regexError?: string;
  trim?: boolean;
  defaultValue?: string | null;
  invalidFormatError?: string;
}

export const createStringSchema = (options: StringSchemaOptions = {}) => {
  const {
    dictionnary,
    required = true,
    requiredError = dictionnary ? "required" : "Field is required",
    minLength,
    minLengthError = dictionnary
      ? "minLengthError"
      : `Must be at least ${minLength} characters`,
    maxLength,
    maxLengthError = dictionnary
      ? "maxLengthError"
      : `Must not exceed ${maxLength} characters`,
    regex,
    regexError = dictionnary ? "invalidFormat" : "Invalid format",
    trim = true,
    defaultValue = "",
    invalidFormatError = dictionnary ? "invalidFormatError" : "Invalid format",
  } = options;

  const getMessage = createGetMessage(dictionnary);

  let schema = z.string({
    invalid_type_error: getMessage(invalidFormatError),
  });

  if (required && (!minLength || minLength === 1)) {
    schema = schema.min(1, getMessage(requiredError));
  }

  if (minLength !== undefined && minLength > 1) {
    schema = schema.min(minLength, getMessage(minLengthError, { minLength }));
  }

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, getMessage(maxLengthError, { maxLength }));
  }

  if (regex) {
    schema = schema.regex(regex, getMessage(regexError));
  }

  if (trim) {
    schema = schema.trim();
  }

  if (!required) {
    schema = schema.optional().nullable() as unknown as z.ZodString;
  }

  if (defaultValue !== null) {
    schema = schema.default(defaultValue) as unknown as z.ZodString;
  }

  return schema;
};
