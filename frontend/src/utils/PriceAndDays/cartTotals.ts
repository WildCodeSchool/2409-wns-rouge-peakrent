import { OrderItem, VoucherType } from "@/gql/graphql";
import { getItemPriceByDates } from "./getPriceByDates";

type VoucherLike = {
  type: VoucherType | "percentage" | "fixed";
  amount: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export function subtotalFromItems(items: OrderItem[]) {
  return items.reduce((sum, it) => {
    return sum + getItemPriceByDates(it);
  }, 0);
}

export function computeDiscountUI(
  subtotalCents: number,
  voucher?: VoucherLike | null
) {
  if (!voucher || !voucher.isActive) return 0;

  const now = new Date();
  const starts = voucher.startsAt ? new Date(voucher.startsAt) : null;
  const ends = voucher.endsAt ? new Date(voucher.endsAt) : null;
  if (starts && now < starts) return 0;
  if (ends && now > ends) return 0;

  if (voucher.type === "percentage") {
    const pct = Math.min(Math.max(Number(voucher.amount) || 0, 1), 100);
    return Math.floor((subtotalCents * pct) / 100);
  }
  return Math.min(Number(voucher.amount) || 0, subtotalCents);
}

export const formatEUR = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
