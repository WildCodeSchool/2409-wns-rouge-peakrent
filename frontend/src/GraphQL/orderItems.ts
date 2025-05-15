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

export const DELETE_ORDER_ITEM = `
mutation DeleteOrderItems($deleteOrderItemsId: ID!) {
  deleteOrderItems(id: $deleteOrderItemsId) {
    id
  }
}
`;
