import { z } from "zod";
import { Voucher } from "@/gql/graphql";
import { createEnumSchema, createStringSchema } from "@/schemas/utils";

// util pour préremplir <input type="datetime-local" />
export function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

export const generateVoucherFormSchema = (datas?: Voucher) => {
  const code = createStringSchema({
    minLength: 2,
    minLengthError: "Le code doit contenir au moins 2 caractères",
    maxLength: 64,
    maxLengthError: "Le code doit contenir au plus 64 caractères",
    defaultValue: datas?.code ?? "",
    required: true,
    requiredError: "Le code est requis",
    trim: true,
  }).transform((s) => s.toUpperCase());

  const type = createEnumSchema(
    ["percentage", "fixed"],
    "Le type est requis",
    "Type invalide",
    (datas?.type as any) ?? "percentage"
  );

  // On stocke amount comme string dans le formulaire (comme userForm),
  // on convertira en number au submit.
  const amount = createStringSchema({
    minLength: 1,
    minLengthError: "Le montant est requis",
    maxLength: 10,
    maxLengthError: "Montant trop grand",
    defaultValue:
      typeof datas?.amount === "number" ? String(datas.amount) : "10",
    required: true,
    requiredError: "Le montant est requis",
    trim: true,
    regex: /^\d+$/,
    regexError:
      "Le montant doit être un entier positif (en cents pour 'fixed')",
  });

  const startsAt = createStringSchema({
    defaultValue: toLocalInput(datas?.startsAt ?? undefined),
    required: false,
    trim: true,
  });

  const endsAt = createStringSchema({
    defaultValue: toLocalInput(datas?.endsAt ?? undefined),
    required: false,
    trim: true,
  });

  // z.boolean() direct (pas de helper boolean dans tes utils)
  const isActive = z
    .boolean()
    .default(datas?.isActive ?? true)
    .describe("isActive");

  return z
    .object({
      code,
      type,
      amount,
      startsAt,
      endsAt,
      isActive,
    })
    .refine(
      (data) => {
        // Vérif dates
        if (!data.startsAt || !data.endsAt) return true;
        return new Date(data.startsAt) <= new Date(data.endsAt);
      },
      { message: "La date de fin doit être ≥ date de début", path: ["endsAt"] }
    )
    .refine(
      (data) => {
        // Si percentage → max 100
        if (data.type !== "percentage") return true;
        const n = parseInt(data.amount, 10);
        return Number.isFinite(n) && n >= 1 && n <= 100;
      },
      { message: "Pourcentage maximum: 100", path: ["amount"] }
    );
};

export type VoucherFormSchema = z.infer<
  ReturnType<typeof generateVoucherFormSchema>
>;
