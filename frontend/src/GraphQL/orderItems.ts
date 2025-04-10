export const CREATE_ORDER_ITEM = `
  mutation CreateOrderItem($data: OrderItemsCreateInput!) {
    createOrderItems(data: $data) {
      id
      quantity
      pricePerHour
    }
  }
`;
