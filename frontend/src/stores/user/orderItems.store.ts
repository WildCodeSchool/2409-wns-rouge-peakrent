import { OrderItem } from "@/gql/graphql";
import { create } from "zustand";

export interface OrderItemStoreState {
  orderItems: OrderItem[];
  ordersFetched: boolean;

  setOrderItems: (orderItems: OrderItem[]) => void;
  setOrderItemsFetched: (fetched: boolean) => void;
  deleteOrderItem: (id: number) => void;
  updateOrderItem: (id: number, orderItem: Partial<OrderItem>) => void;
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

  updateOrderItem: (id, updatedOrderItem) =>
    set((state) => ({
      orderItems: state.orderItems.map((orderItem: OrderItem) =>
        Number(orderItem.id) === id
          ? { ...orderItem, ...updatedOrderItem }
          : orderItem
      ),
    })),

  addOrderItem: (orderItem) =>
    set((state) => ({
      orderItems: [...state.orderItems, orderItem],
    })),
}));
