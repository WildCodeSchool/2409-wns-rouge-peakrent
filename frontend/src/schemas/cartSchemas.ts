import { z } from "zod";
import {
  addressRegex,
  cityRegex,
  letterRegex,
  nameRegex,
  numberRegex,
  zipCodeRegex,
} from "./regex";
import { createStringSchema } from "./utils";

// TODO : API Avec la liste des pays / Ville ? A ajouter ici + dans resolver pour check ?
export const cartCheckoutSchema = z.object({
  address1: createStringSchema({
    minLength: 1,
    minLengthError: "L'adresse doit contenir au moins 1 caractère",
    maxLength: 255,
    maxLengthError: "L'adresse doit contenir au plus 255 caractères",
    regex: addressRegex,
    regexError: "Format de l'adresse invalide",
    required: true,
    requiredError: "L'adresse est requise",
  }),
  address2: createStringSchema({
    minLength: 1,
    minLengthError: "L'adresse 2 doit contenir au moins 1 caractère",
    maxLength: 255,
    maxLengthError: "L'adresse 2 doit contenir au plus 255 caractères",
    required: false,
  }),
  zipCode: createStringSchema({
    minLength: 1,
    minLengthError: "Le code postale doit contenir au moins 1 caractère",
    maxLength: 20,
    maxLengthError: "Le code postale doit contenir au plus 20 caractères",
    regex: zipCodeRegex,
    regexError: "Format du code postale invalide",
    required: true,
    requiredError: "Le code postale est requis",
  }),
  city: createStringSchema({
    minLength: 1,
    minLengthError: "La ville doit contenir au moins 1 caractère",
    maxLength: 100,
    maxLengthError: "La ville doit contenir au plus 100 caractères",
    regex: cityRegex,
    regexError: "Format de la ville invalide",
    required: true,
    requiredError: "La ville est requise",
  }),
  country: createStringSchema({
    minLength: 1,
    minLengthError: "Le pays doit contenir au moins 1 caractère",
    maxLength: 100,
    maxLengthError: "Le pays doit contenir au plus 100 caractères",
    regex: letterRegex,
    regexError: "Format du pays invalide",
    required: true,
    requiredError: "Le pays est requis",
  }),
});

export type CartCheckoutType = z.infer<typeof cartCheckoutSchema>;

export const cartPaymentSchemaBase = (isRequired: boolean) =>
  z.object({
    cardName: createStringSchema({
      minLength: 2,
      minLengthError: "Le nom doit contenir au moins 2 caractères.",
      maxLength: 50,
      maxLengthError: "Le nom doit contenir au plus 50 caractères.",
      regex: nameRegex,
      regexError: "Le format du nom est invalide.",
      required: isRequired,
      requiredError: "Le nom est requis.",
    }),
    cardNumber: createStringSchema({
      minLength: 13,
      minLengthError:
        "Le numéro de carte bancaire doit contenir au minimum 13 chiffres.",
      maxLength: 19,
      maxLengthError:
        "Le numéro de carte bancaire ne peut pas dépasser 19 chiffres.",
      regex: numberRegex,
      regexError: "Le numéro de carte bancaire est invalide.",
      required: isRequired,
      requiredError: "Le numéro de carte bancaire est requis.",
    }),
    expirationDate: createStringSchema({
      minLength: 5,
      minLengthError:
        "La date d'expiration doit contenir au minimum 5 caractères (exemple : 05/25).",
      maxLength: 7,
      maxLengthError: "La date d'expiration ne peut pas dépasser 7 caractères.",
      regex: /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/,
      regexError:
        "Le format de la date d'expiration est invalide (exemple : 05/25).",
      required: isRequired,
      requiredError: "La date d'expiration est requise.",
    }),
    cvv: createStringSchema({
      minLength: 3,
      minLengthError: "Le code de sécurité doit contenir au moins 3 chiffres.",
      maxLength: 4,
      maxLengthError: "Le code de sécurité ne peut pas dépasser 4 chiffres.",
      regex: numberRegex,
      regexError: "Le code de sécurité est invalide.",
      required: isRequired,
      requiredError: "Le code de sécurité (CVV) est requis.",
    }),
  });
