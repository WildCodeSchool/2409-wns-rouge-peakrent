import { CartItemCard } from "@/components/cards/CartItemCard";
import Resume from "@/components/resume/Resume";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { OrderItem } from "@/gql/graphql";
import {
  DELETE_ORDER_ITEM_CART,
  UPDATE_ORDER_ITEM_CART,
} from "@/GraphQL/orderItems";
import { cn } from "@/lib/utils";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useMutation } from "@apollo/client";
import { ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

export function CartPage() {
  const orderItemsStore = useOrderItemStore((state) => state.orderItems);
  const deleteOrderItemStore = useOrderItemStore(
    (state) => state.deleteOrderItem
  );
  const updateOrderItemStore = useOrderItemStore(
    (state) => state.updateOrderItem
  );
  const [deleteOrderItem] = useMutation(gql(DELETE_ORDER_ITEM_CART));
  const [updateOrderItem] = useMutation(gql(UPDATE_ORDER_ITEM_CART));

  const handleUpdateError = (err: any) => {
    const codeError = err.graphQLErrors?.[0]?.extensions?.code;
    if (codeError === "OUT_OF_STOCK") {
      toast.error("Quantité indisponible pour ce produit ");
    } else {
      console.error("Erreur lors de la modification de l'item :", err);
      toast.error("Erreur lors de la modification de l'item");
    }
  };

  const deleteOrderItembyId = async (orderItemId: string) => {
    await deleteOrderItem({
      variables: {
        orderItemId: Number(orderItemId),
      },
    });
    deleteOrderItemStore(Number(orderItemId));
  };

  const handleDelete = async (orderItemId: string) => {
    try {
      await deleteOrderItembyId(orderItemId);
      toast.success(`Produit supprimé du panier`);
    } catch (err) {
      toast.error(`Erreur de suppression de l'item`);
      console.error("Erreur de suppression de l'item :", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (const orderItem of orderItemsStore) {
        await deleteOrderItembyId(orderItem.id);
      }
      toast.success(`Produits supprimés du panier`);
    } catch (err) {
      console.error("Erreur de suppression d'un item :", err);
      toast.error("Erreur de suppression d'un ou plusieurs items");
    }
  };

  const handleQuantityChange = async (id: string, value: number) => {
    const orderId = Number(id);
    try {
      const updatedOrderItem = await updateOrderItem({
        variables: {
          orderId,
          data: { quantity: value },
        },
      });
      updateOrderItemStore(orderId, updatedOrderItem.data.updateOrderItemUser);
    } catch (err: any) {
      handleUpdateError(err);
    }
  };

  const handleDateChange = async (
    id: string,
    isStartDate: boolean,
    value: string
  ) => {
    const orderId = Number(id);
    const item = orderItemsStore.find((el) => Number(el.id) === orderId);
    if (item) {
      const start = new Date(isStartDate ? value : item.startsAt).getTime();
      const end = new Date(isStartDate ? item.endsAt : value).getTime();

      if (start > end) {
        return toast.error(
          "La date de début ne peut pas être supérieure à la date de fin"
        );
      }
    }
    try {
      const date = new Date(value).toISOString();
      const data = isStartDate ? { startsAt: date } : { endsAt: date };
      const updatedOrderItem = await updateOrderItem({
        variables: {
          orderId,
          data,
        },
      });
      updateOrderItemStore(orderId, updatedOrderItem.data.updateOrderItemUser);
    } catch (err: any) {
      handleUpdateError(err);
    }
  };

  return (
    <div className="mx-2 lg:mx-28 max-w-8xl">
      <Title
        text="Panier de commande"
        className="my-4 md:my-6"
        icon={<ShoppingBag className="size-8" />}
      />
      {orderItemsStore.length > 0 ? (
        <div className="flex gap-4 flex-col items-center lg:items-start lg:flex-row lg:gap-9">
          <>
            <section>
              <div className="flex gap-1 justify-between items-center">
                <Button
                  onClick={() => handleDeleteAll()}
                  type="button"
                  className="mb-4"
                  variant="outline"
                >
                  Vider mon panier
                </Button>
                <p>{orderItemsStore.length} items</p>
              </div>
              {orderItemsStore.map((orderItem: OrderItem) => (
                <article key={orderItem.id} className="mb-4">
                  <CartItemCard
                    item={orderItem}
                    onRemoveItem={() => handleDelete(orderItem.id)}
                    onQuantityChange={(value) =>
                      handleQuantityChange(orderItem.id, value)
                    }
                    onDateChange={(isStartDate, value) =>
                      handleDateChange(orderItem.id, isStartDate, value)
                    }
                  />
                </article>
              ))}
            </section>
            <aside className="flex flex-col w-full lg:w-1/3 lg:sticky lg:top-16 lg:h-fit gap-4">
              <Resume
                orderItems={orderItemsStore}
                promo={0}
                className="lg:self-end"
              />
              <NavLink
                to="checkout"
                aria-label="Navigation vers la page de paiement"
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "py-2 px-4 cursor-pointer text-center w-full lg:max-w-[250px] lg:self-end"
                )}
              >
                Continuer vers le paiement
              </NavLink>
            </aside>
          </>
        </div>
      ) : (
        <p>Vous n&apos;avez aucun produit dans votre panier</p>
      )}
    </div>
  );
}
