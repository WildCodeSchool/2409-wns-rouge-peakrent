export const CREATE_ORDER_ITEM = `
  mutation CreateOrderItem($data: OrderItemsCreateInput!) {
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

export const GET_ORDER_ITEMS_CART_BY_PROFILE_ID = `
query GetOrderItemsCartByProfileId {
  getOrderItemsCartByProfileId {
    id
    orderItems {
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
}
`;

export const DELETE_ORDER_ITEM_CART = `
mutation DeleteOrderItemForCartForUSer($orderItemId: ID!) {
  deleteOrderItemForCartForUSer(id: $orderItemId) {
    id
  }
}
`;

export const UPDATE_ORDER_ITEM_CART = `
mutation UpdateOrderItemUser($data: OrderItemsUpdateInputForUser!, $orderId: ID!) {
  updateOrderItemUser(data: $data, id: $orderId) {
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
