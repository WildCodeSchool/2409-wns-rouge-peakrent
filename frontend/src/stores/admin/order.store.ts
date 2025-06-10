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

  deleteOrder: (id: string) => void;
  deleteMultipleOrders: (ids: string[]) => void;

  deleteOrderItem: (id: string) => void;
  deleteOrderItems: (ids: string[]) => void;

  updateOrder: (id: string, order: Partial<Order>) => void;
  updateOrderItem: (id: string, item: Partial<OrderItem>) => void;

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
      orders: state.orders.filter((order) => order.id !== id),
    })),
  deleteMultipleOrders: (ids) =>
    set((state) => ({
      orders: state.orders.filter((order) => !ids.includes(order.id)),
    })),

  deleteOrderItem: (id) => {
    console.log("id", id, typeof id);
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.orderItemsForm?.filter(
          (item: OrderItem) => item.id !== id
        ),
      },
    }));
  },

  deleteOrderItems: (ids) =>
    set((state) => ({
      currentOrder: {
        ...state.currentOrder!,
        orderItems: state.orderItemsForm?.filter(
          (item: OrderItem) => !ids.includes(item?.id)
        ),
      },
    })),

  updateOrder: (id: string, order: Partial<Order>) =>
    set((state) => {
      const updatedOrders = state.orders.map((o) =>
        o.id === id ? { ...o, ...order } : o
      );

      const updatedCurrentOrder =
        state.currentOrder?.id === id && state.currentOrder
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
              i.id === id ? { ...i, ...item } : i
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

// export const deleteOrder = (ids: string[]) => {
//   const id = ids[0];
//   const { deleteOrder } = useOrderStore.getState();
//   deleteOrder(id);
// };

// export const deleteMultipleOrders = (ids: string[]) => {
//   const { deleteMultipleOrders } = useOrderStore.getState();
//   deleteMultipleOrders(ids);
// };

export const deleteFormOrderItem = (id: string) => {
  const { setOrderItemsForm, orderItemsForm } = useOrderStore.getState();
  setOrderItemsForm(orderItemsForm?.filter((item) => item.id !== id) || []);
};

export const deleteMultipleFormOrderItems = (ids: string[]) => {
  const { setOrderItemsForm, orderItemsForm } = useOrderStore.getState();
  setOrderItemsForm(
    orderItemsForm?.filter((item) => !ids.includes(item.id)) || []
  );
};

export const updateOrder = (id: string, order: Partial<Order>) => {
  const { updateOrder } = useOrderStore.getState();
  updateOrder(id, order);
};

export const updateOrderItem = (id: string, item: Partial<OrderItem>) => {
  const { updateOrderItem } = useOrderStore.getState();
  updateOrderItem(id, item);
};

// export const addOrder = (newOrder: Order) => {
//   const { addOrder } = useOrderStore.getState();
//   addOrder(newOrder);
// };

// export const addOrderItem = (newOrderItem: OrderItem) => {
//   const { addOrderItem } = useOrderStore.getState();
//   addOrderItem(newOrderItem);
// };

export const setFormOrderItem = (orderItem: OrderItem | null) => {
  const { setFormOrderItem } = useOrderStore.getState();
  setFormOrderItem(orderItem);
};
