import { z } from "zod";
import { addressRegex, cityRegex, nameRegex, zipCodeRegex } from "./regex";

export const createAdressTitleNameSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "addressTitleRequired",
    })
    .max(100, "addressTitleMaxLength")
    .regex(nameRegex, "addressTitleInvalidFormat")
    .default(data ?? undefined);

export const createCitySchema = (data: any = undefined) =>
  z
    .string({
      required_error: "cityRequired",
    })
    .max(100, "cityMaxLength")
    .regex(cityRegex, "cityInvalidFormat")
    .default(data ?? undefined);

export const createZipCodeSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "zipcodeRequired",
    })
    .regex(zipCodeRegex, "zipcodeInvalidFormat")
    .default(data ?? undefined);

export const createAddressSchema = (data: any = undefined) =>
  z
    .string({
      required_error: "addressRequired",
    })
    .min(5, { message: "addressTooShort" })
    .max(255, { message: "addressMaxLength" })
    .regex(addressRegex, {
      message: "addressInvalidFormat",
    })
    .default(data ?? undefined);

export const createComplementAddressSchema = (data: any = undefined) =>
  z
    .string()
    .max(255, { message: "complementAddressMaxLength" })
    .regex(addressRegex, {
      message: "complementAddressInvalidFormat",
    })
    .optional()
    .nullable()
    .default(data?.trim() === "" ? undefined : (data ?? undefined));
