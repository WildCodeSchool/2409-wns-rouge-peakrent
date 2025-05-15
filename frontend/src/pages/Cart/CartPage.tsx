import { CartItemCard } from "@/components/cards/CartItemCard";
import Resume from "@/components/resume/Resume";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { OrderItem } from "@/gql/graphql";
import { DELETE_ORDER_ITEM } from "@/GraphQL/orderItems";
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
  const updateOrderItemQuantityStore = useOrderItemStore(
    (state) => state.updateOrderItemQuantity
  );
  const [deleteOrderItem] = useMutation(gql(DELETE_ORDER_ITEM));

  const deleteOrderItembyId = async (orderItemId: string) => {
    await deleteOrderItem({
      variables: {
        deleteOrderItemsId: Number(orderItemId),
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
      toast.error(`Erreur de suppression d'un ou plusieurs items`);
    }
  };

  //TODO Charlotte
  // Vérifier l'availability, changer envoit à l'API, ajouter changement date
  const handleQuantityChange = (id: string, value: number) => {
    updateOrderItemQuantityStore(Number(id), Number(value));
  };

  return (
    <div className="mx-2 lg:mx-35">
      <Title
        text="Panier de commande"
        className="my-4 md:my-6"
        icon={<ShoppingBag className="size-8" />}
      />
      <Button onClick={(e) => handleDeleteAll()} type="button" className="mb-4">
        Vider mon panier
      </Button>
      <section className="flex gap-4 lg:gap-9 flex-col md:flex-row">
        {orderItemsStore.length > 0 ? (
          <>
            <div>
              {orderItemsStore.map((orderItem: OrderItem) => (
                <div key={orderItem.id} className="mb-4">
                  <CartItemCard
                    item={orderItem}
                    onRemoveItem={() => handleDelete(orderItem.id)}
                    onQuantityChange={(value) =>
                      handleQuantityChange(orderItem.id, value)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-5 w-full md:w-1/3">
              <Resume orderItems={orderItemsStore} promo={0} />
              <NavLink
                to="checkout"
                aria-label="Navigation vers la page de paiement"
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "py-2 px-4 cursor-pointer text-center md:w-5/6 self-end"
                )}
              >
                Continuer vers le paiement
              </NavLink>
            </div>
          </>
        ) : (
          <p>Vous n&apos;avez aucun produit dans votre panier</p>
        )}
      </section>
    </div>
  );
}
