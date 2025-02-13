import { gql } from "@apollo/client";

export const DELETE_CATEGORY = gql`
  mutation Mutation($id: ID!) {
    deleteCategory(id: $id) {
      name
    }
  }
`;
