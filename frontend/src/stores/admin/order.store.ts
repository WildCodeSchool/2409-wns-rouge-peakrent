import { create } from "zustand";

type OrderType = any;
type OrderItemType = any;

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
