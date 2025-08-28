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

export const GET_ORDER_BY_REF_ADMIN = `
  query GetOrderByRefAdmin($ref: String!) {
    getOrderByRefAdmin(ref: $ref) {
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
      id
      reference
      status
      paymentMethod
      address1
      address2
      city
      country
      zipCode
      date
      paidAt
      createdAt
      updatedAt
      discountAmount
      chargedAmount
      voucher {
        id
        code
        type
        amount
        isActive
        startsAt
        endsAt
      }
      profile {
        id
        email
        firstname
        lastname
      }
      orderItems {
        id
        startsAt
        endsAt
        quantity
        pricePerHour
        createdAt
        updatedAt
        status
        variant {
          id
          pricePerHour
          size
          color
          product {
            id
            sku
            urlImage
            name
          }
        }
      }
    }
  }
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
