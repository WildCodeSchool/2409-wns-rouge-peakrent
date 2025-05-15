import { OrderItem } from "@/gql/graphql";
import { create } from "zustand";

export interface OrderItemStoreState {
  orderItems: OrderItem[];
  ordersFetched: boolean;

  setOrderItems: (orderItems: OrderItem[]) => void;
  setOrderItemsFetched: (fetched: boolean) => void;

  deleteOrderItem: (id: number) => void;
  updateOrderItemQuantity: (id: number, updatedItemQuantity: number) => void;
  addOrderItem: (orderItem: OrderItem) => void;
}

export const useOrderItemStore = create<OrderItemStoreState>((set, get) => ({
  orderItems: [],
  ordersFetched: false,

  setOrderItems: (orderItems) => set({ orderItems }),
  setOrderItemsFetched: (fetched) => set({ ordersFetched: fetched }),

  deleteOrderItem: (id) =>
    set((state) => ({
      orderItems: state.orderItems.filter(
        (orderItem) => Number(orderItem.id) !== id
      ),
    })),

  updateOrderItemQuantity: (id, updatedItemQuantity) =>
    set((state) => ({
      orderItems: state.orderItems.map((orderItem: OrderItem) =>
        Number(orderItem.id) === id
          ? { ...orderItem, quantity: updatedItemQuantity }
          : orderItem
      ),
    })),

  addOrderItem: (orderItem) =>
    set((state) => ({
      orderItems: [...state.orderItems, orderItem],
    })),
}));
