import { Voucher, VoucherType } from "@/entities/Voucher";
import { GraphQLError } from "graphql";

export const computeDiscountAmount = (
  subtotal: number,
  voucher?: Voucher
): number => {
  if (!voucher) return 0;
  // if date null alors valable tout le temps
  if (!voucher.isActive) {
    throw new GraphQLError("This voucher is no more active", {
      extensions: { code: "VOUCHER_NOT_APPLICABLE" },
    });
  }

  const now = new Date();
  if (voucher.startsAt && now < voucher.startsAt) {
    throw new GraphQLError("This voucher is will be active soon", {
      extensions: { code: "VOUCHER_NOT_APPLICABLE" },
    });
  }
  if (voucher.endsAt && now > voucher.endsAt) {
    throw new GraphQLError("This voucher is depreciated", {
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
