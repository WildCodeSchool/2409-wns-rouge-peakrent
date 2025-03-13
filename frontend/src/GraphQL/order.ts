import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation Mutation($data: OrderCreateInput!) {
    createOrder(data: $data) {
      address1
      address2
      city
      country
      createdAt
      id

      paymentMethod
      reference
      status
      updatedAt
      zipCode
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($getOrderByIdId: ID!) {
    getOrderById(id: $getOrderByIdId) {
      address1
      address2
      city
      country
      createdAt
      id
      paidAt
      paymentMethod
      profile {
        email
        firstname
        lastname
      }
      reference
      status
      updatedAt
      zipCode
    }
  }
`;
