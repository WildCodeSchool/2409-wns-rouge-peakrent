import { gql } from "@apollo/client/core";

export const UPDATE_CATEGORY = gql`
  mutation Mutation($data: CategoryUpdateInput!, $id: ID!) {
    updateCategory(data: $data, id: $id) {
      id
      name
    }
  }
`;
