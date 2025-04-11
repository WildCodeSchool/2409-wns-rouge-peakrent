import { Cart } from "@/gql/graphql";
import { create } from "zustand";

export interface CartStoreState {
  carts: Cart[];
  cartsFetched: boolean;

  setCarts: (carts: Cart[]) => void;
  setCartsFetched: (fetched: boolean) => void;

  deleteCart: (id: number) => void;
  deleteMultipleCarts: (ids: number[]) => void;

  updateCart: (id: number, cart: Partial<Cart>) => void;
  addCart: (cart: Cart) => void;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  carts: [],
  cartsFetched: false,

  setCarts: (carts) => set({ carts }),
  setCartsFetched: (fetched) => set({ cartsFetched: fetched }),

  deleteCart: (id) =>
    set((state) => ({
      carts: state.carts.filter((cart) => Number(cart.id) !== id),
    })),

  deleteMultipleCarts: (ids) =>
    set((state) => ({
      carts: state.carts.filter((cart) => !ids.includes(Number(cart.id))),
    })),

  updateCart: (id, updatedCart) =>
    set((state) => ({
      carts: state.carts.map((cart) =>
        Number(cart.id) === id ? { ...cart, ...updatedCart } : cart
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

export const updateCart = (id: number, cart: Partial<Cart>) => {
  const { updateCart } = useCartStore.getState();
  updateCart(id, cart);
};

export const addCart = (cart: Cart) => {
  const { addCart } = useCartStore.getState();
  addCart(cart);
};
