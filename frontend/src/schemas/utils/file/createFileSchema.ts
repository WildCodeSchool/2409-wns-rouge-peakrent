import { z } from "zod";

import { createGetMessage } from "../createGetMessage";

interface FileSchemaOptions {
  dictionnary?: MessagesIntl;
  maxSize?: number;
  maxSizeError?: string;
  allowedTypes?: string[];
  allowedTypesError?: string;
  maxFiles?: number;
  maxFilesError?: string;
  required?: boolean;
  defaultValue?: File[];
}

export const createFileSchema = (
  options: FileSchemaOptions = {}
): z.ZodType<any> => {
  const {
    dictionnary,
    maxSize = 3 * 1024 * 1024,
    maxSizeError = dictionnary ? "fileTooLarge" : "File is too large",
    allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
    allowedTypesError = dictionnary
      ? "unsupportedFileType"
      : "Unsupported file type",
    maxFiles = 5,
    maxFilesError = dictionnary
      ? "maxFilesReached"
      : "Maximum number of files reached",
    required = false,
    defaultValue = [],
  } = options;

  const getMessage = createGetMessage(dictionnary);

  const fileSchema = z.object({
    file: z
      .instanceof(File)
      .refine((file) => allowedTypes.includes(file.type), {
        message: getMessage(allowedTypesError),
      }),
    size: z.number().max(maxSize, {
      message: getMessage(maxSizeError),
    }),
  });

  let schemaToReturn =
    maxFiles > 1
      ? z.array(fileSchema).max(maxFiles, {
          message: getMessage(maxFilesError),
        })
      : fileSchema;

  if (!required) {
    schemaToReturn = schemaToReturn.optional().nullable() as any;
  }

  if (defaultValue.length > 0) {
    schemaToReturn = (schemaToReturn as z.ZodType<any>).default(
      defaultValue
    ) as any;
  }

  return schemaToReturn;
};
