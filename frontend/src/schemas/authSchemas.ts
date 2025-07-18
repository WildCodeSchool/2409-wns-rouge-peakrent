import { z } from "zod";
import { nameRegex } from "./regex";
import { createEmailSchema } from "./utils";

export const createPasswordSchema = () =>
  z
    .string({
      required_error: "Le mot de passe est requis",
    })
    .min(12, {
      message: "Le mot de passe doit contenir au moins 12 caractères",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Le mot de passe doit contenir au moins une lettre majuscule",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Le mot de passe doit contenir au moins une lettre minuscule",
    })
    .regex(/(?=.*\d)/, {
      message: "Le mot de passe doit contenir au moins un chiffre",
    })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
      message: "Le mot de passe doit contenir au moins un caractère spécial",
    });

export const createFirstnameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "Le prénom est requis",
    })
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom ne doit pas excéder 50 caractères" })
    .regex(nameRegex, {
      message: "Le prénom est invalide",
    })
    .default(data);

export const createLastnameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "Le nom est requis",
    })
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne doit pas excéder 50 caractères" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
      message: "Le nom est invalide",
    })
    .default(data);

export const createResetPasswordFormSchema = () => {
  return z
    .object({
      newPassword: createPasswordSchema(),
      newPasswordConfirm: createPasswordSchema(),
    })
    .refine(
      ({ newPassword, newPasswordConfirm }) =>
        newPassword === newPasswordConfirm,
      {
        path: ["newPasswordConfirm"],
        message: "Les mots de passe ne correspondent pas",
      }
    );
};

export type ResetPasswordFormValuesType = z.infer<
  ReturnType<typeof createResetPasswordFormSchema>
>;

export const createSignUpFormSchema = () =>
  z
    .object({
      firstname: createFirstnameSchema(),
      lastname: createLastnameSchema(),
      email: createEmailSchema({
        requiredError: "L'adresse email est requise",
        invalidFormatError: "Format d'email invalide",
        maxLengthError: "L'adresse email ne doit pas excéder 320 caractères",
      }),
      password: createPasswordSchema(),
      confirmPassword: createPasswordSchema(),
      agreeToPolicy: z.boolean().refine((val) => val === true, {
        message: "Vous devez accepter les conditions d'utilisation",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });

export type SignUpFormValuesType = z.infer<
  ReturnType<typeof createSignUpFormSchema>
>;
