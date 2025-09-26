import { CreditCard, Home, Phone } from "lucide-react";

import CopyButton from "@/components/buttons/CopyButton";
import { Button, Card, CardContent, Separator } from "@/components/ui";
import { Order as OrderType } from "@/gql/graphql";
import {
  GET_ORDER_BY_ID_ADMIN,
  GET_ORDER_BY_REF_ADMIN,
  UPDATE_ORDER_ADMIN,
} from "@/graphQL/order";
import { computeDiscountUI, formatLocaleDate, getPriceFixed } from "@/utils";

import { getTotalOrderPrice } from "@/utils/PriceAndDays/getTotalOrderPrice";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

export function OrderByIdDetailsHeaderSection({ order }: { order: OrderType }) {
  const totalTTC = getTotalOrderPrice(order.orderItems ?? [], true);
  const { date, time } = formatLocaleDate(order.paidAt as string);
  const voucherAmount = computeDiscountUI(
    Number(totalTTC),
    order.voucher,
    true
  );

  const [updateOrderAdmin, { loading: updating }] = useMutation(
    gql(UPDATE_ORDER_ADMIN),
    {
      refetchQueries: [gql(GET_ORDER_BY_ID_ADMIN), gql(GET_ORDER_BY_REF_ADMIN)],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success("Paiement mis à jour avec succès");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const togglePaidAt = async () => {
    const newPaidAt = order.paidAt ? null : new Date().toISOString();
    await updateOrderAdmin({
      variables: { id: String(order.id), data: { paidAt: newPaidAt } },
    });
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="p-6">
        <CardContent className="flex w-full flex-col gap-4 p-0">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3 ">
              <CreditCard className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Montant Total</h2>
              <p className="text-muted-foreground">Détails</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-2">
            <div className="flex justify-between">
              <span>HT:</span>
              <span>{getPriceFixed(Number(totalTTC) / 1.2)} €</span>
            </div>
            <div className="flex justify-between ">
              <span>TTC:</span>
              <div className="flex gap-2">
                <span>{getPriceFixed(totalTTC)} €</span>
              </div>
            </div>
            <div className="flex justify-between ">
              <span>Montant du voucher:</span>
              <div className="flex gap-2">
                <span>
                  {order.voucher ? getPriceFixed(voucherAmount) : 0} €
                </span>
              </div>
            </div>
            <div className="flex justify-between ">
              <span>TTC avec coucher:</span>
              <div className="flex gap-2">
                <span>{getPriceFixed(Number(totalTTC) - voucherAmount)} €</span>
              </div>
            </div>
            {/* <div className="flex justify-between">
              <span>Discount:</span>
              <span>{totalDiscount?.toFixed(2)} €</span>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="relative flex w-full flex-col gap-4 p-0">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3 ">
              <Home className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Adresse</h2>
              <p className="text-muted-foreground">Adresse de livraison</p>
            </div>
          </div>
          <div className="pt-2">
            <p
              className="text-foreground flex gap-2 truncate"
              title={order.profile?.firstname + " " + order.profile?.lastname}
            >
              {order.profile?.firstname} {order.profile?.lastname}
              <CopyButton
                className="size-5"
                toCopy={
                  order.profile?.firstname + " " + order.profile?.lastname
                }
                copiedText="Copié !"
              />
            </p>
            <p
              className="text-muted-foreground flex gap-2 truncate pb-2"
              title={order.profile?.email ?? ""}
            >
              {order.profile?.email}
              <CopyButton
                className="text-foreground size-5"
                toCopy={order.profile?.email ?? ""}
                copiedText="Copié !"
              />
            </p>
            <p
              className="text-muted-foreground truncate"
              title={order.address1 ?? ""}
            >
              {order.address1}
            </p>
            <p
              className="text-muted-foreground min-h-4 truncate"
              title={order.address2 || ""}
            >
              {order.address2}
            </p>
            <p className="text-muted-foreground">
              {order.zipCode} {order.city}
            </p>
            <div className="text-muted-foreground flex items-center justify-between gap-2 uppercase">
              <div className="flex items-center gap-2">{order.country}</div>
              <div className="absolute right-0">
                <span className="flex items-center gap-1">
                  <Phone size={16} />
                  {order.phone}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="relative flex size-full flex-col justify-evenly gap-4 p-0">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3 ">
              <CreditCard className="size-6" />
            </div>
            <div>
              <div className="flex gap-2">
                <h2 className="text-xl font-bold"> Paiement</h2>
              </div>
              <p className="text-muted-foreground mt-1">
                <span>
                  {date || "--"} à {time || "--"}
                </span>
              </p>
              <p className="text-muted-foreground mt-1 uppercase">
                <span>{order.paymentMethod}</span>
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-center">
            <Button
              variant={order.paidAt ? "orange" : "primary"}
              onClick={togglePaidAt}
              disabled={updating}
            >
              {order.paidAt ? "Marquer comme non payé" : "Marquer comme payé"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
