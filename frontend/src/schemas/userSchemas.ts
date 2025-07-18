import { Profile } from "@/gql/graphql";
import { createPasswordSchema } from "@/schemas/authSchemas";
import { nameRegex } from "@/schemas/regex";
import {
  createEmailSchema,
  createEnumSchema,
  createStringSchema,
} from "@/schemas/utils";
import { z } from "zod";

export const generateUserFormSchema = (datas?: Profile) =>
  z.object({
    firstname: createStringSchema({
      minLength: 2,
      minLengthError: "Le prénom doit contenir au moins 2 caractères",
      maxLength: 50,
      maxLengthError: "Le prénom doit contenir au plus 50 caractères",
      regex: nameRegex,
      regexError: "Format de prénom invalide",
      trim: true,
      defaultValue: datas?.firstname,
      required: true,
      requiredError: "Le prénom est requis",
    }),
    lastname: createStringSchema({
      minLength: 2,
      minLengthError: "Le nom doit contenir au moins 2 caractères",
      maxLength: 50,
      maxLengthError: "Le nom doit contenir au plus 50 caractères",
      regex: nameRegex,
      regexError: "Format de nom invalide",
      trim: true,
      defaultValue: datas?.lastname,
      required: true,
      requiredError: "Le nom est requis",
    }),
    email: createEmailSchema({
      defaultValue: datas?.email,
      requiredError: "L'email est requis",
      invalidFormatError: "Format d'email invalide",
    }),
    ...(datas ? {} : { password: createPasswordSchema() }),
    role: createEnumSchema(
      ["user", "admin", "superadmin"],
      "Le rôle est requis",
      "Role invalide",
      datas?.role
    ),
  });

export type UserFormSchema = z.infer<ReturnType<typeof generateUserFormSchema>>;

export const generateUpdateEmailFormSchema = () =>
  z.object({
    newEmail: createEmailSchema({
      requiredError: "Le nouvel email est requis",
      invalidFormatError: "Format d'email invalide",
    }),
    password: createPasswordSchema(),
  });

export const generateChangePasswordFormSchema = () =>
  z
    .object({
      currentPassword: createPasswordSchema(),
      newPassword: createPasswordSchema(),
      confirmNewPassword: createPasswordSchema(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmNewPassword"],
    });

export type UpdateEmailFormSchema = z.infer<
  ReturnType<typeof generateUpdateEmailFormSchema>
>;
export type ChangePasswordFormSchema = z.infer<
  ReturnType<typeof generateChangePasswordFormSchema>
>;
