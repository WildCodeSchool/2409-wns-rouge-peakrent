import { gql } from "@apollo/client/core";

export const GET_CARTS = gql`
  query GetCarts {
    getCarts {
      id
      profile {
        id
        email
        firstname
        lastname
        role
        createdAt
        updatedAt
      }
      address1
      address2
      country
      city
      zipCode
      createdAt
      updatedAt
    }
  }
`;
