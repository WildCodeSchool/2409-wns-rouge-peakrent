import { gql } from "@apollo/client/core";

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

export const GET_ORDERS = gql`
  query getOrders {
    getOrders {
      id
      reference
      status
      paymentMethod
      paidAt
      address1
      address2
      country
      city
      zipCode
      createdAt
      updatedAt
      profile {
        email
        firstname
        lastname
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: Int!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      status
      total
      createdAt
      updatedAt
      user {
        id
        email
      }
      store {
        id
        name
      }
      order_items {
        id
        quantity
        price
        product {
          id
          name
        }
      }
    }
  }
`;
