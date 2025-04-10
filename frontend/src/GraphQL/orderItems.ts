import { gql } from "@apollo/client";

export const CREATE_ORDER_ITEM = gql`
  mutation CreateOrderItem($data: OrderItemsCreateInput!) {
    createOrderItems(data: $data) {
      id
      quantity
      pricePerHour
    }
  }
`;
