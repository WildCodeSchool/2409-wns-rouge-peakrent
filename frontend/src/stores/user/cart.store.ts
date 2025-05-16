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
  commandTunnelStatus: string;

  setCart: (cart: Cart) => void;
  setCartFetched: (fetched: boolean) => void;
  setCommandTunnelStatus: (status: CommandStatusEnum) => void;
}

export const useCartStoreUser = create<CartStoreUserState>((set) => ({
  cart: null,
  cartFetched: false,
  commandTunnelStatus: "pending",

  setCart: (cart) => set({ cart }),
  setCartFetched: (fetched) => set({ cartFetched: fetched }),
  setCommandTunnelStatus: (status) => set({ commandTunnelStatus: status }),
}));
