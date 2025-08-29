import { OrderItem } from "@/gql/graphql";
import { useCartStoreUser } from "@/stores/user/cart.store";
import { totalDays } from "@/utils";
import { computeDiscountUI, formatEUR } from "@/utils/cartTotals";

type VoucherLike =
  | {
      type: "percentage" | "fixed";
      amount: number;
      isActive: boolean;
      startsAt?: string | null;
      endsAt?: string | null;
    }
  | null
  | undefined;

type Props = {
  orderItems: OrderItem[];
  className?: string;
  voucher?: VoucherLike;
  discountCentsOverride?: number;
  totalCentsOverride?: number;
};

const TotalResume = ({
  orderItems,
  className,
  voucher,
  discountCentsOverride,
  totalCentsOverride,
}: Props) => {
  const subTotal = orderItems.reduce((acc, it) => {
    const days =
      it.startsAt && it.endsAt ? totalDays(it.startsAt, it.endsAt) : 1;
    const pricePerDay = it.pricePerDay ?? 0;
    const qty = it.quantity ?? 1;
    return acc + days * qty * pricePerDay;
  }, 0);

  const cart = useCartStoreUser((s) => s.cart);

  const voucherFromStore = cart?.voucher
    ? {
        type: cart.voucher.type as "percentage" | "fixed",
        amount: Number(cart.voucher.amount),
        isActive: !!cart.voucher.isActive,
        startsAt: cart.voucher.startsAt ?? null,
        endsAt: cart.voucher.endsAt ?? null,
      }
    : undefined;

  const effectiveVoucher =
    typeof voucher !== "undefined" ? voucher : voucherFromStore;

  const discount =
    typeof discountCentsOverride === "number"
      ? discountCentsOverride
      : computeDiscountUI(subTotal, effectiveVoucher);

  const total =
    typeof totalCentsOverride === "number"
      ? totalCentsOverride
      : Math.max(subTotal - discount, 0);

  return (
    <div
      className={`border rounded-xs bg-gray-100 p-4 w-full lg:max-w-[350px] ${className ?? ""}`}
    >
      <h2 className="text-center">Résumé</h2>
      <p className="flex justify-between">
        Sous-total <span>{formatEUR(subTotal)}</span>
      </p>
      <hr className="border-t-2 border-gray-300 my-2" />
      <p className="flex justify-between">
        Promo <span>{formatEUR(discount)}</span>
      </p>
      <hr className="border-t-2 border-gray-300 my-2" />
      <p className="flex justify-between">
        Total <span>{formatEUR(total)}</span>
      </p>
    </div>
  );
};

export default TotalResume;
