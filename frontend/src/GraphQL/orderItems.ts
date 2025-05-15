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
query GetOrderItemsCartByProfileId($profileId: Int!) {
  getOrderItemsCartByProfileId(id: $profileId) {
    id
    variant {
      pricePerHour
      color
      size
      product {
        id
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

export const DELETE_ORDER_ITEM = `
mutation DeleteOrderItems($deleteOrderItemsId: ID!) {
  deleteOrderItems(id: $deleteOrderItemsId) {
    id
  }
}
`;
