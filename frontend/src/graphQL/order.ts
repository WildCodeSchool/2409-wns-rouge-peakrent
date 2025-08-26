import {
  ORDER_FIELDS,
  ORDER_WITH_ITEMS_FIELDS_ADMIN,
  ORDER_WITH_ITEMS_FIELDS_USER,
} from "./fragments";

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
      ...OrderWithItemsFieldsAdmin
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_ADMIN}
`;

export const GET_ORDER_BY_REF = `
  query GetOrderByReference($reference: String!) {
    getOrderByReference(reference: $reference) {
      ...OrderWithItemsFieldsUser
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_USER}
`;

export const GET_ORDER_BY_ID = `
  query GetOrderById($getOrderByIdId: ID!) {
    getOrderById(id: $getOrderByIdId) {
      ...OrderWithItemsFieldsUser
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_USER}
`;

export const GET_ORDERS_ADMIN = `
  query getOrdersAdmin {
    getOrdersAdmin {
      ...OrderWithItemsFieldsAdmin
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_ADMIN}
`;

export const UPDATE_ORDER = `
  mutation UpdateOrder($id: Int!, $data: UpdateOrderInput!) {
    updateOrder(id: $id, data: $data) {
      ...OrderWithItemsFieldsAdmin
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_ADMIN}
`;

export const CREATE_ORDER_WITH_ITEMS = `
  mutation CreateOrderWithItems($data: OrderCreateInput!, $items: [OrderItemsFormInput!]!) {
    createOrderWithItems(data: $data, items: $items) {
      ...OrderWithItemsFieldsAdmin
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_ADMIN}
`;

export const GET_MY_ORDERS = `
  query getMyOrders {
    getMyOrders {
      ...OrderWithItemsFieldsUser
    }
  }
  ${ORDER_WITH_ITEMS_FIELDS_USER}
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
