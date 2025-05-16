import { Order, OrderItem } from "@/gql/graphql";
import { create } from "zustand";

export interface OrderStoreState {
  orders: NonNullable<Order>[];
  ordersFetched: boolean;

  currentOrder: Order | null;
  currentOrderFetched: boolean;

  orderItemsForm: OrderItem[] | null;
  defaultOrderItemsForm: OrderItem[] | null;
  formOrderItem: OrderItem | null;

  setOrderItemsForm: (orderItemsForm: OrderItem[]) => void;
  setDefaultOrderItemsForm: (defaultOrderItemsForm: OrderItem[]) => void;
  setFormOrderItem: (formOrderItem: OrderItem | null) => void;

  setStore: (store: OrderStoreState) => void;

  setOrdersFetched: (bool: boolean) => void;
  setCurrentOrderFetched: (bool: boolean) => void;

  setOrders: (orders: NonNullable<Order>[]) => void;
  setCurrentOrder: (order: NonNullable<Order>) => void;

  deleteOrder: (id: number) => void;
  deleteMultipleOrders: (ids: number[]) => void;

  deleteOrderItem: (id: number) => void;
  deleteOrderItems: (ids: number[]) => void;

  updateOrder: (id: number, order: Partial<Order>) => void;
  updateOrderItem: (id: number, item: Partial<OrderItem>) => void;

  addOrder: (newOrder: Order) => void;
  addOrderItem: (newOrderItem: OrderItem) => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],
  ordersFetched: false,

  currentOrder: null,
  currentOrderFetched: false,

  orderItemsForm: null,
  defaultOrderItemsForm: [],
  formOrderItem: null,

  setOrderItemsForm: (orderItemsForm) => set({ orderItemsForm }),
  setDefaultOrderItemsForm: (defaultOrderItemsForm) =>
    set({ defaultOrderItemsForm }),
  setFormOrderItem: (formOrderItem) => set({ formOrderItem }),

  setStore: (store) => set(store),

  setOrdersFetched: (bool: boolean) => set({ ordersFetched: bool }),
  setCurrentOrderFetched: (bool: boolean) => set({ currentOrderFetched: bool }),

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => Number(order.id) !== id),
    })),
  deleteMultipleOrders: (ids) =>
    set((state) => ({
      orders: state.orders.filter((order) => !ids.includes(Number(order.id))),
    })),

  deleteOrderItem: (id) =>
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.orderItemsForm?.filter(
          (item: OrderItem) => Number(item?.id) !== id
        ),
      },
    })),

  deleteOrderItems: (ids) =>
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.orderItemsForm?.filter(
          (item: OrderItem) => !ids.includes(Number(item?.id))
        ),
      },
    })),

  updateOrder: (id: number, order: Partial<Order>) =>
    set((state) => {
      const updatedOrders = state.orders.map((o) =>
        Number(o.id) === id ? { ...o, ...order } : o
      );

      const updatedCurrentOrder =
        Number(state.currentOrder?.id) === id && state.currentOrder
          ? { ...state.currentOrder, ...order }
          : state.currentOrder;

      return {
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder,
      };
    }),

  updateOrderItem: (id, item) =>
    set((state) => ({
      currentOrder: state.currentOrder
        ? {
            ...state.currentOrder,
            order_items: state.orderItemsForm?.map((i: OrderItem) =>
              Number(i.id) === id ? { ...i, ...item } : i
            ),
          }
        : null,
    })),

  addOrder: (newOrder) =>
    set((state) => ({
      orders: [...state.orders, newOrder],
    })),

  addOrderItem: (newOrderItem) =>
    set((state) => ({
      orderItemsForm: [...(state.orderItemsForm || []), newOrderItem],
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

export const updateOrder = (id: number, order: Partial<Order>) => {
  const { updateOrder } = useOrderStore.getState();
  updateOrder(id, order);
};

export const updateOrderItem = (id: number, item: Partial<OrderItem>) => {
  const { updateOrderItem } = useOrderStore.getState();
  updateOrderItem(id, item);
};

export const addOrder = (newOrder: Order) => {
  const { addOrder } = useOrderStore.getState();
  addOrder(newOrder);
};

export const addOrderItem = (newOrderItem: OrderItem) => {
  const { addOrderItem } = useOrderStore.getState();
  addOrderItem(newOrderItem);
};

export const setFormOrderItem = (orderItem: OrderItem | null) => {
  const { setFormOrderItem } = useOrderStore.getState();
  setFormOrderItem(orderItem);
};
