import { gql } from "@apollo/client/core";

export const SIGNIN = gql`
  mutation Mutation($datas: SignInInput!) {
    signIn(datas: $datas) {
      id
    }
  }
`;
