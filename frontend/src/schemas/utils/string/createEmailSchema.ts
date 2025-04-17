import { z } from "zod";

import { emailRegex } from "@/schemas/regex";
import { createGetMessage } from "../createGetMessage";

interface EmailSchemaOptions {
  dictionnary?: any;
  requiredError?: string;
  defaultValue?: string;
  maxLength?: number;
  maxLengthError?: string;
  regex?: RegExp;
  invalidFormatError?: string;
  whitelist?: string[];
  blacklist?: string[];
}

export const createEmailSchema = (options: EmailSchemaOptions = {}) => {
  const {
    dictionnary,
    requiredError = dictionnary ? "emailRequired" : "Email is required",
    defaultValue = "",
    maxLength = 320,
    maxLengthError = dictionnary
      ? "maxLengthError"
      : `Must not exceed ${maxLength} characters`,
    regex = emailRegex,
    invalidFormatError = dictionnary
      ? "emailInvalidFormat"
      : "Invalid email format",
    whitelist,
    blacklist,
  } = options;

  const getMessage = createGetMessage(dictionnary);

  const schema = z
    .string({
      required_error: getMessage(requiredError),
    })
    .email({ message: getMessage(invalidFormatError) })
    .max(maxLength, getMessage(maxLengthError, { maxLength }))
    .regex(regex, getMessage(invalidFormatError))
    .refine(
      (email) => (whitelist?.length ? whitelist?.includes(email) : true),
      {
        message: dictionnary
          ? dictionnary("emailNotWhitelisted")
          : "Email is not whitelisted",
      }
    )
    .refine(
      (email) => (blacklist?.length ? !blacklist?.includes(email) : true),
      {
        message: dictionnary
          ? dictionnary("emailBlacklisted")
          : "Email is blacklisted",
      }
    );

  return schema.default(defaultValue);
};
