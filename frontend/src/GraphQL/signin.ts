import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation Mutation($password: String!, $email: String!) {
    signIn(password: $password, email: $email) {
      id
    }
  }
`;
