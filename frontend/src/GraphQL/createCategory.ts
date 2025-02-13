import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation Mutation($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
      name
    }
  }
`;
