import { ORDER_FIELDS } from "./fragments";

export const CREATE_ORDER = `
  mutation Mutation($data: OrderCreateInputAdmin!) {
    createOrderAdmin(data: $data) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const GET_ORDER_BY_ID_ADMIN = `
  query GetOrderByIdAdmin($id: ID!) {
    getOrderByIdAdmin(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const GET_ORDER_BY_ID = `
  query GetOrderById($getOrderByIdId: ID!) {
    getOrderById(id: $getOrderByIdId) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const GET_ORDERS_ADMIN = `
  query getOrdersAdmin {
    getOrdersAdmin {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const UPDATE_ORDER = `
  mutation UpdateOrder($id: Int!, $data: UpdateOrderInput!) {
    updateOrder(id: $id, data: $data) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const CREATE_ORDER_WITH_ITEMS = `
  mutation CreateOrderWithItems($data: OrderCreateInput!, $items: [OrderItemsFormInput!]!) {
    createOrderWithItems(data: $data, items: $items) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const GET_MY_ORDERS = `
  query getMyOrders {
    getMyOrders {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS}
`;

export const UPDATE_ORDER_ADMIN = `
  mutation UpdateOrderAdmin($id: ID!, $data: OrderUpdateInputAdmin!) {
    updateOrderAdmin(id: $id, data: $data) {
      id
      paidAt
      updatedAt
    }
  }
`;
