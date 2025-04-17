import { z } from "zod";
import { nameRegex } from "./regex";

export const createPasswordSchema = () =>
  z
    .string({
      required_error: "passwordRequired",
    })
    .min(8, {
      message: "passwordMinLength",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "passwordUppercase",
    })
    .regex(/(?=.*[a-z])/, {
      message: "passwordLowercase",
    })
    .regex(/(?=.*\d)/, {
      message: "passwordDigit",
    })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
      message: "passwordSpecialChar",
    });

export const createFirstnameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "firstnameRequired",
    })
    .min(2, { message: "firstnameTooShort" })
    .max(50, { message: "firstnameMaxLength" })
    .regex(nameRegex, {
      message: "firstnameInvalid",
    })
    .default(data);

export const createLastnameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "lastnameRequired",
    })
    .min(2, { message: "lastnameTooShort" })
    .max(50, { message: "lastnameMaxLength" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
      message: "lastnameInvalid",
    })
    .default(data);
