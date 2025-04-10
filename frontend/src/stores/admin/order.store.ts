import { OrderItemType, OrderType } from "@/types/types";
import { create } from "zustand";

export interface OrderStoreState {
  orders: NonNullable<OrderType>[];
  ordersFetched: boolean;

  currentOrder: OrderType | null;
  currentOrderFetched: boolean;

  setStore: (store: OrderStoreState) => void;

  setOrdersFetched: (bool: boolean) => void;
  setCurrentOrderFetched: (bool: boolean) => void;

  setOrders: (orders: NonNullable<OrderType>[]) => void;
  setCurrentOrder: (order: NonNullable<OrderType>) => void;

  deleteOrder: (id: number) => void;
  deleteMultipleOrders: (ids: number[]) => void;

  deleteOrderItem: (id: number) => void;
  deleteOrderItems: (ids: number[]) => void;

  updateOrder: (id: number, order: Partial<OrderType>) => void;
  updateOrderItem: (id: number, item: Partial<OrderItemType>) => void;

  addOrder: (newOrder: OrderType) => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],
  ordersFetched: false,

  currentOrder: null,
  currentOrderFetched: false,

  setStore: (store) => set(store),

  setOrdersFetched: (bool: boolean) => set({ ordersFetched: bool }),
  setCurrentOrderFetched: (bool: boolean) => set({ currentOrderFetched: bool }),

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
  deleteMultipleOrders: (ids) =>
    set((state) => ({
      orders: state.orders.filter((order) => !ids.includes(order.id as number)),
    })),

  deleteOrderItem: (id) =>
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.currentOrder!.order_items?.filter(
          (item: OrderItemType) => item?.id !== id
        ),
      },
    })),

  deleteOrderItems: (ids) =>
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.currentOrder!.order_items?.filter(
          (item: OrderItemType) => !ids.includes(item?.id as number)
        ),
      },
    })),

  updateOrder: (id, order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
      currentOrder:
        state.currentOrder?.id === id
          ? { ...state.currentOrder, ...order }
          : state.currentOrder,
    })),

  updateOrderItem: (id, item) =>
    set((state) => ({
      currentOrder: state.currentOrder
        ? {
            ...state.currentOrder,
            order_items: state.currentOrder.order_items?.map(
              (i: OrderItemType) => (i.id === id ? { ...i, ...item } : i)
            ),
          }
        : null,
    })),

  addOrder: (newOrder) =>
    set((state) => ({
      orders: [...state.orders, newOrder],
    })),
}));

export const deleteOrder = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteOrder } = useOrderStore.getState();
  deleteOrder(id as number);
};

export const deleteMultipleOrders = (ids: (string | number)[]) => {
  const { deleteMultipleOrders } = useOrderStore.getState();
  deleteMultipleOrders(ids as number[]);
};

export const deleteOrderItem = (ids: (string | number)[]) => {
  const id = ids[0];
  const { deleteOrderItem } = useOrderStore.getState();
  deleteOrderItem(id as number);
};

export const deleteMultipleOrderItems = (ids: (string | number)[]) => {
  const { deleteOrderItems } = useOrderStore.getState();
  deleteOrderItems(ids as number[]);
};

export const updateOrder = (id: number, order: Partial<OrderType>) => {
  const { updateOrder } = useOrderStore.getState();
  updateOrder(id, order);
};

export const updateOrderItem = (id: number, item: Partial<OrderItemType>) => {
  const { updateOrderItem } = useOrderStore.getState();
  updateOrderItem(id, item);
};

export const addOrder = (newOrder: OrderType) => {
  const { addOrder } = useOrderStore.getState();
  addOrder(newOrder);
};
