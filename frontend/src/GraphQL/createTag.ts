import { gql } from "@apollo/client";

export const CREATE_TAG = gql`
  mutation Mutation($data: TagCreateInput!) {
    createTag(data: $data) {
      id
      name
    }
  }
`;
