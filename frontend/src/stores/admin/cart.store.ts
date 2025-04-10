import { CartType } from "@/types/types";
import { create } from "zustand";

export interface CartStoreState {
  carts: CartType[];
  cartsFetched: boolean;

  setCarts: (carts: CartType[]) => void;
  setCartsFetched: (fetched: boolean) => void;

  deleteCart: (id: number) => void;
  deleteMultipleCarts: (ids: number[]) => void;

  updateCart: (id: number, cart: Partial<CartType>) => void;
  addCart: (cart: CartType) => void;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  carts: [],
  cartsFetched: false,

  setCarts: (carts) => set({ carts }),
  setCartsFetched: (fetched) => set({ cartsFetched: fetched }),

  deleteCart: (id) =>
    set((state) => ({
      carts: state.carts.filter((cart) => cart.id !== id),
    })),

  deleteMultipleCarts: (ids) =>
    set((state) => ({
      carts: state.carts.filter((cart) => !ids.includes(cart.id)),
    })),

  updateCart: (id, updatedCart) =>
    set((state) => ({
      carts: state.carts.map((cart) =>
        cart.id === id ? { ...cart, ...updatedCart } : cart
      ),
    })),

  addCart: (cart) =>
    set((state) => ({
      carts: [...state.carts, cart],
    })),
}));

export const deleteCart = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteCart } = useCartStore.getState();
  deleteCart(id as number);
};

export const deleteMultipleCarts = (ids: (string | number)[]) => {
  const { deleteMultipleCarts } = useCartStore.getState();
  deleteMultipleCarts(ids as number[]);
};

export const updateCart = (id: number, cart: Partial<CartType>) => {
  const { updateCart } = useCartStore.getState();
  updateCart(id, cart);
};

export const addCart = (cart: CartType) => {
  const { addCart } = useCartStore.getState();
  addCart(cart);
};
