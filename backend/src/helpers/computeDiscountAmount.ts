import { Voucher, VoucherType } from "@/entities/Voucher";

export const computeDiscountAmount = (
  subtotal: number,
  voucher?: Voucher
): number => {
  if (!voucher) return 0;
  if (!voucher.isActive) return 0;

  const now = new Date();
  if (voucher.startsAt && now < voucher.startsAt) return 0;
  if (voucher.endsAt && now > voucher.endsAt) return 0;

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
