import { Button } from "@/components/ui/button";
import { GET_CART_BY_USER } from "@/graphQL";
import { CREATE_PAYMENT_INTENT } from "@/graphQL/stripe";
import { APPLY_VOUCHER, REMOVE_VOUCHER } from "@/graphQL/vouchers";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  currentCode?: string | null;
  onChanged?: () => Promise<any> | void;
};

export function CartVoucherBox({ currentCode, onChanged }: Props) {
  const [code, setCode] = useState("");
  const [applyVoucher, { loading: applying }] = useMutation(
    gql(APPLY_VOUCHER),
    {
      refetchQueries: [
        { query: gql(GET_CART_BY_USER), variables: { withOrderItems: true } },
      ],
      awaitRefetchQueries: true,
    }
  );
  const [removeVoucher, { loading: removing }] = useMutation(
    gql(REMOVE_VOUCHER),
    {
      refetchQueries: [
        { query: gql(GET_CART_BY_USER), variables: { withOrderItems: true } },
      ],
      awaitRefetchQueries: true,
    }
  );

  const [createPI, { loading: creatingPI }] = useMutation(
    CREATE_PAYMENT_INTENT
  );
  const loc = useLocation();
  const isOnPayment = loc.pathname.startsWith("/cart/checkout/payment");
  const isOnRecap = loc.pathname.startsWith("/cart/recap/");

  const refreshPIIfNeeded = async () => {
    if (isOnPayment) {
      try {
        await createPI();
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? "Erreur lors du recalcul du paiement");
      }
    }
  };

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    try {
      await applyVoucher({ variables: { code: trimmed } });
      await refreshPIIfNeeded();
      await onChanged?.();
      setCode("");
      toast.success("Code appliqué 🎉");
    } catch (e: any) {
      toast.error(e?.message ?? "Impossible d'appliquer le code");
    }
  };

  const handleRemove = async () => {
    try {
      await removeVoucher();
      await refreshPIIfNeeded();
      await onChanged?.();
      toast.success("Code retiré");
    } catch (e: any) {
      toast.error(e?.message ?? "Impossible de retirer le code");
    }
  };

  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 font-medium">Code de réduction</div>

      {currentCode ? (
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="mr-2 rounded bg-primary/10 px-2 py-1 font-mono">
              {currentCode}
            </span>
          </div>
          {!isOnRecap && (
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={removing || creatingPI}
            >
              Retirer
            </Button>
          )}
        </div>
      ) : isOnRecap ? null : (
        <div className="flex gap-2 w-full">
          <input
            className="input flex-1 min-w-0"
            placeholder="RENT20"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button
            onClick={handleApply}
            disabled={!code || applying || creatingPI}
          >
            Appliquer
          </Button>
        </div>
      )}
    </div>
  );
}
