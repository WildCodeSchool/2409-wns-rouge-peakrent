import { gql } from "@apollo/client/core";

export const CREATE_USER = gql`
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
