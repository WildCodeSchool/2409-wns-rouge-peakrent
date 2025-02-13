import { gql } from "@apollo/client";

export const UPDATE_TAG = gql`
  mutation Mutation($data: TagUpdateInput!, $id: ID!) {
    updateTag(data: $data, id: $id) {
      id
      name
    }
  }
`;
