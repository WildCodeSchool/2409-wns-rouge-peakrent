import { GET_CART_BY_USER } from "@/graphQL/carts";
import { cn } from "@/lib/utils";
import { useCartStoreUser } from "@/stores/user/cart.store";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useQuery } from "@apollo/client";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";

const NavCartLink = () => {
  const orderItemsStore = useOrderItemStore((state) => state.orderItems);
  const setOrderItems = useOrderItemStore((state) => state.setOrderItems);
  const setOrderItemsFetched = useOrderItemStore(
    (state) => state.setOrderItemsFetched
  );
  const ordersFetched = useOrderItemStore((state) => state.ordersFetched);
  const setCart = useCartStoreUser((state) => state.setCart);
  const setCatFetched = useCartStoreUser((state) => state.setCartFetched);

  const { data, loading, error } = useQuery(gql(GET_CART_BY_USER), {
    variables: { withOrderItems: true },
    skip: ordersFetched,
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des items du panier");
      console.error(
        "Erreur lors de la récupération des items du paniers:",
        error
      );
      return;
    }

    if (data?.getCart) {
      setCart(data.getCart);
      setOrderItems(data.getCart.orderItems);
      setOrderItemsFetched(true);
      setCatFetched(true);
    }
  }, [
    data,
    error,
    setOrderItems,
    setOrderItemsFetched,
    setCart,
    setCatFetched,
  ]);

  return (
    <NavLink
      to="/cart"
      aria-label="Navigation vers la page panier"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative py-2 px-4 cursor-pointer text-center"
      )}
    >
      <ShoppingCart size={24} className="flex-none font-normal" />

      {orderItemsStore.length > 0 && !loading && (
        <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {orderItemsStore.length}
        </span>
      )}
    </NavLink>
  );
};

export default NavCartLink;
