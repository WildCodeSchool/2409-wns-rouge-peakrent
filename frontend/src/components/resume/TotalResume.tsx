import { OrderItem } from "@/gql/graphql";
import { useCartStoreUser } from "@/stores/user/cart.store";
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

const hoursBetween = (start: string, end: string) => {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / 3_600_000));
};

const TotalResume = ({
  orderItems,
  className,
  voucher,
  discountCentsOverride,
  totalCentsOverride,
}: Props) => {
  const subTotal = orderItems.reduce((acc, it) => {
    if (!it.startsAt || !it.endsAt) return acc;
    const h = hoursBetween(it.startsAt, it.endsAt);
    return acc + h * it.quantity * it.pricePerHour;
  }, 0);

  const cart = useCartStoreUser((s) => s.cart);

  const voucherFromStore = cart?.voucher
    ? {
        type: cart.voucher.type,
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
