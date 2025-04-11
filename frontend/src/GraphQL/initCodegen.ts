import { gql } from "@apollo/client";

export const INIT_CODEGEN = gql`
  query GetCartByProfile($profileId: Int!) {
    getCartByProfile(profileId: $profileId) {
      id
    }
  }
`;
