import { Cart } from "@/gql/graphql";
import { create } from "zustand";

export enum CommandStatusEnum {
  pending = "pending",
  validated = "validated",
  onPayment = "onPayment",
  completed = "completed",
}

export interface CartStoreUserState {
  cart: Cart | null;
  cartFetched: boolean;
  commandTunnelStatus: CommandStatusEnum;

  setCart: (cart: Cart) => void;
  setCartFetched: (fetched: boolean) => void;
  setCommandTunnelStatus: (status: CommandStatusEnum) => void;
  updateCart: (cart: Partial<Cart> | null) => void;
}

export const useCartStoreUser = create<CartStoreUserState>((set) => ({
  cart: null,
  cartFetched: false,
  commandTunnelStatus: CommandStatusEnum.pending,

  setCart: (cart) => set({ cart }),
  setCartFetched: (fetched) => set({ cartFetched: fetched }),
  setCommandTunnelStatus: (status) => set({ commandTunnelStatus: status }),
  updateCart: (updatedCart) =>
    set((state) => {
      if (!state.cart) return state;
      return {
        cart: {
          ...state.cart,
          ...updatedCart,
        },
      };
    }),
}));
