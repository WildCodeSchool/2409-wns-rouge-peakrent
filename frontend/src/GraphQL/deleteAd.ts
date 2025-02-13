import { gql } from "@apollo/client";

export const DELETE_AD = gql`
  mutation Mutation($id: ID!) {
    deleteAd(id: $id) {
      title
    }
  }
`;
