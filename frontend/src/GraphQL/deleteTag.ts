import { gql } from "@apollo/client";

export const DELETE_TAG = gql`
  mutation Mutation($id: ID!) {
    deleteTag(id: $id) {
      name
    }
  }
`;
