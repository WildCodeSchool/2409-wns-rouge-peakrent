import { CartItemCard } from "@/components/cards/CartItemCard";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/gql/graphql";
import {
  DELETE_ORDER_ITEM_CART,
  DELETE_ORDER_ITEMS_CART,
  UPDATE_ORDER_ITEM_CART,
} from "@/graphQL/orderItems";
import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "sonner";

export function CartPage() {
  const orderItemsStore = useOrderItemStore((state) => state.orderItems);
  const deleteOrderItemStore = useOrderItemStore(
    (state) => state.deleteOrderItem
  );
  const deleteOrderItemsStore = useOrderItemStore(
    (state) => state.deleteAllOrderItems
  );
  const updateOrderItemStore = useOrderItemStore(
    (state) => state.updateOrderItem
  );
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );
  const [deleteOrderItem] = useMutation(gql(DELETE_ORDER_ITEM_CART));
  const [deleteOrderItems] = useMutation(gql(DELETE_ORDER_ITEMS_CART));
  const [updateOrderItem] = useMutation(gql(UPDATE_ORDER_ITEM_CART));

  useEffect(() => {
    setCommandTunnelStatus(CommandStatusEnum.pending);
  }, []);

  const handleUpdateError = (err: any) => {
    const codeError = err.graphQLErrors?.[0]?.extensions?.code;
    if (codeError === "OUT_OF_STOCK") {
      toast.error("Quantité indisponible pour ce produit");
    } else {
      console.error("Erreur lors de la modification de l'item :", err);
      toast.error("Erreur lors de la modification de l'item");
    }
  };

  const handleDelete = async (orderItemId: string) => {
    try {
      await deleteOrderItem({
        variables: { orderItemId: Number(orderItemId) },
      });
      deleteOrderItemStore(Number(orderItemId));
      toast.success("Produit supprimé du panier");
    } catch (err) {
      console.error("Erreur de suppression de l'item :", err);
      toast.error("Erreur de suppression de l'item");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteOrderItems();
      deleteOrderItemsStore();
      toast.success("Produits supprimés du panier");
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
      updateOrderItemStore(orderId, updatedOrderItem.data.updateOrderItem);
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
    const item = orderItemsStore.find(
      (orderItem) => Number(orderItem.id) === orderId
    );

    if (item) {
      const start = new Date(isStartDate ? value : item.startsAt).getTime();
      const end = new Date(isStartDate ? item.endsAt : value).getTime();

      if (start > end) {
        return toast.error(
          "La date de fin ne peut pas être inférieure à celle de début"
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
      updateOrderItemStore(orderId, updatedOrderItem.data.updateOrderItem);
    } catch (err: any) {
      handleUpdateError(err);
    }
  };

  return (
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

      <div className="space-y-4">
        {orderItemsStore.map((orderItem: OrderItem) => (
          <CartItemCard
            key={orderItem.id}
            item={orderItem}
            onRemoveItem={() => handleDelete(orderItem.id)}
            onQuantityChange={(value) =>
              handleQuantityChange(orderItem.id, value)
            }
            onDateChange={(isStartDate, value) =>
              handleDateChange(orderItem.id, isStartDate, value)
            }
          />
        ))}
      </div>
    </section>
  );
}
