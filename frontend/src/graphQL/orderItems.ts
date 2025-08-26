export const CREATE_ORDER_ITEM = `
  mutation CreateOrderItemsAdmin($data: OrderItemsCreateInput!) {
    createOrderItemsAdmin(data: $data) {
      id
      variant {
        pricePerHour
        color
        size
        product {
          name
          sku
          urlImage
          description
        }
      }
      pricePerHour
      quantity
      startsAt
      endsAt
    }
  }
`;

export const CREATE_ORDER_ITEM_USER = `
  mutation createOrderItems($data: OrderItemsCreateInput!) {
    createOrderItems(data: $data) {
      id
      variant {
        pricePerHour
        color
        size
        product {
          name
          sku
          urlImage
          description
        }
      }
      pricePerHour
      quantity
      startsAt
      endsAt
    }
  }
`;

export const DELETE_ORDER_ITEM_CART = `
mutation deleteOrderItemForCart($orderItemId: ID!) {
  deleteOrderItemForCart(id: $orderItemId) {
    id
  }
}
`;

export const DELETE_ORDER_ITEMS_CART = `
  mutation Mutation {
    deleteOrderItemsCart
  }
`;

export const UPDATE_ORDER_ITEM_CART = `
mutation updateOrderItem($data: OrderItemsUpdateInput!, $orderId: ID!) {
  updateOrderItem(data: $data, id: $orderId) {
      id
      quantity
      pricePerHour
      startsAt
      endsAt
      variant {
        color
        id
        pricePerHour
        product {
          description
          name
          sku
          urlImage
          id
        }
        size
    }
  }
}
`;

export const UPDATE_ORDER_ITEM_ADMIN = `
mutation updateOrderItemAdmin($id: ID!, $data: OrderItemsUpdateInputAdmin!) {
  updateOrderItemAdmin(id: $id, data: $data) {
    id
    startsAt
    endsAt
    quantity
    pricePerHour
    status
    variant {
      id
      size
      pricePerHour
      product {
        id
        sku
        urlImage
        name
      }
    }
  }
}
`;
