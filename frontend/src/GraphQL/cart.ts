import { gql } from "@apollo/client";

export const GET_CART_BY_PROFILE_ID = gql`
  query GetCartByProfile($id: ID!) {
    getCartByProfile(profileId: $id) {
      id
    }
  }
`;

export const CREATE_CART = gql`
  mutation CreateCart($data: CartCreateInput!) {
    createCart(data: $data) {
      id
    }
  }
`;
