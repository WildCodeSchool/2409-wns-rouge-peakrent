import { GET_ORDER_ITEMS_CART_BY_PROFILE_ID } from "@/GraphQL/orderItems";
import { cn } from "@/lib/utils";
import { useOrderItemStore } from "@/stores/user/orderItems.store";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";

type NavCartLinkProps = {
  profileId?: number;
};

const NavCartLink = ({ profileId }: NavCartLinkProps) => {
  const orderItemsStore = useOrderItemStore((state) => state.orderItems);
  const setOrderItems = useOrderItemStore((state) => state.setOrderItems);
  const setOrderItemsFetched = useOrderItemStore(
    (state) => state.setOrderItemsFetched
  );
  const ordersFetched = useOrderItemStore((state) => state.ordersFetched);

  const { data, loading, error } = useQuery(
    gql(GET_ORDER_ITEMS_CART_BY_PROFILE_ID),
    {
      variables: { profileId },
      skip: !profileId || ordersFetched,
    }
  );

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des items du paniers");
      console.error(
        "Erreur lors de la récupération des items du paniers:",
        error
      );
      return;
    }

    if (data?.getOrderItemsCartByProfileId) {
      setOrderItems(data.getOrderItemsCartByProfileId);
      setOrderItemsFetched(true);
    }
  }, [data, error, setOrderItems, setOrderItemsFetched]);

  return (
    <NavLink
      to="/cart"
      aria-label="Navigation vers la page panier"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative py-2 px-4 cursor-pointer text-center"
      )}
    >
      <CiShoppingCart size={30} className="flex-none" />

      {profileId && orderItemsStore.length > 0 && !loading && (
        <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {orderItemsStore.length}
        </span>
      )}
    </NavLink>
  );
};

export default NavCartLink;
