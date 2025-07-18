import { z } from "zod";
import { nameRegex } from "./regex";

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
