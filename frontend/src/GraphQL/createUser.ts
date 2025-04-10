import { gql } from "@apollo/client/core";

export const CREATE_USER = `
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const CREATE_USER_FRONT = gql`
  ${CREATE_USER}
`;
