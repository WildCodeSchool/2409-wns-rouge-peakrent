import { Voucher, VoucherType } from "@/entities/Voucher";
import { GraphQLError } from "graphql";

export const computeDiscountAmount = (
  subtotal: number,
  voucher?: Voucher
): number => {
  // if date null alors valable tout le temps
  if (!voucher || !voucher.isActive) {
    throw new GraphQLError("Voucher not applicable", {
      extensions: { code: "VOUCHER_NOT_APPLICABLE" },
    });
  }

  const now = new Date();
  if (voucher.startsAt && now < voucher.startsAt) {
    throw new GraphQLError("Voucher not applicable", {
      extensions: { code: "VOUCHER_NOT_APPLICABLE" },
    });
  }
  if (voucher.endsAt && now > voucher.endsAt) {
    throw new GraphQLError("Voucher not applicable", {
      extensions: { code: "VOUCHER_NOT_APPLICABLE" },
    });
  }

  if (voucher.type === VoucherType.percentage) {
    const pct = Math.min(Math.max(voucher.amount, 1), 100);
    return Math.floor((subtotal * pct) / 100);
  }

  return Math.min(voucher.amount, subtotal);
};

export const computeTotal = (subtotal: number, voucher?: Voucher) => {
  const discount = computeDiscountAmount(subtotal, voucher);
  return { discount, total: Math.max(subtotal - discount, 0) };
};
