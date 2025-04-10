import { gql } from "@apollo/client";

export const GET_STORES = gql`
  query getStores {
    getStores {
      id
      name
      phoneNumber
      address1
      address2
      city
      zipCode
      country
      reference
      createdAt
      updatedAt
    }
  }
`;
