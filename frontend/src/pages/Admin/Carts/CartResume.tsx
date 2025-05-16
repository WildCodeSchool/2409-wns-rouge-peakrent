import { useModal } from "@/context/modalProvider";

import { Button } from "@/components/ui/button";

import { CartItemCard } from "@/components/cards/CartItemCard";
import MehSection from "@/components/section/MehSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Cart as CartType } from "@/gql/graphql";
import { getDurationInDays } from "@/utils/getDurationInDays";
import { Home } from "lucide-react";

export function CartResume({ cart }: { cart: CartType }) {
  const { closeModal } = useModal();
  const orderItems = cart.orderItems ?? [];

  const totalPrice = orderItems.reduce(
    (acc, item) =>
      acc +
      (item.pricePerHour / 100) *
        item.quantity *
        getDurationInDays(item.startsAt, item.endsAt),
    0
  );

  const nbOrderItems = orderItems?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <section className="flex flex-col pb-2">
      <div className="flex items-center gap-2 ">
        <Home size={24} />
        <h3 className="text-base sm:text-lg font-bold underline underline-offset-4">
          Adresse
        </h3>
      </div>
      <div className="">
        <p
          className="text-muted-foreground truncate"
          title={cart.address1 ?? ""}
        >
          {cart.address1 ?? "---"}
        </p>
        <p
          className="text-muted-foreground min-h-6 truncate"
          title={cart.address2 ?? "---"}
        >
          {cart.address2 ?? "---"}
        </p>
        <p className="text-muted-foreground">
          {cart.zipCode ?? "---"} {cart.city ?? "---"}
        </p>
        <div className="text-muted-foreground flex items-center justify-between gap-2 uppercase">
          <div className="flex items-center gap-2">
            <span className="h-4 w-6">{cart.country ?? "---"}</span>
          </div>
        </div>
      </div>
      <h3 className="text-end text-lg font-semibold pr-3">
        Articles: {nbOrderItems}
      </h3>
      <Separator className="mb-4" />
      <ScrollArea className="h-[35vh] rounded-md border-0 py-1 pr-3">
        <div className="space-y-4">
          {orderItems.map((item) => {
            return <CartItemCard item={item} key={item.id} />;
          })}
        </div>
      </ScrollArea>
      {orderItems.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <MehSection text="Le panier est vide" className="text-lg" />
        </div>
      )}
      <Separator className="my-4" />
      <h3 className="text-center text-lg font-semibold">Résumé du panier</h3>
      <div className="flex w-full flex-col justify-between mb-4">
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground block">Total:</span>
          <span className="ml-2">{totalPrice?.toFixed(2)} €</span>
        </p>
      </div>
      <div className="col-span-2 flex w-full items-center justify-center gap-2">
        <Button
          variant="primary"
          className="w-full"
          size="icon"
          aria-label=""
          title=""
          onClick={() => {
            closeModal();
          }}
        >
          Fermer
        </Button>
      </div>
    </section>
  );
}
