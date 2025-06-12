import { z } from "zod";
import { addressRegex, cityRegex, nameRegex, zipCodeRegex } from "./regex";

export const createAdressTitleNameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "Le titre est requis",
    })
    .max(100, "Le titre est trop long")
    .regex(nameRegex, "Le titre est invalide")
    .default(data ?? undefined);

export const createCitySchema = (data: any = undefined) =>
  z
    .string({
      required_error: "La ville est requise",
    })
    .max(100, "La ville est trop longue")
    .regex(cityRegex, "La ville est invalide")
    .default(data ?? undefined);

export const createZipCodeSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "Le code postal est requis",
    })
    .regex(zipCodeRegex, "Le code postal est invalide")
    .default(data ?? undefined);

export const createAddressSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "L'adresse est requise",
    })
    .min(5, { message: "L'adresse est trop courte" })
    .max(255, { message: "L'adresse est trop longue" })
    .regex(addressRegex, {
      message: "L'adresse est invalide",
    })
    .default(data ?? undefined);

export const createComplementAddressSchema = (data: any = undefined) =>
  z
    .string()
    .max(255, { message: "Le complément d'adresse est trop long" })
    .regex(addressRegex, {
      message: "Le complément d'adresse est invalide",
    })
    .optional()
    .nullable()
    .default(data?.trim() === "" ? undefined : (data ?? undefined));
