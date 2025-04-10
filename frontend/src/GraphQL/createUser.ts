import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
