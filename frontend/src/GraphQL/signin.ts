import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation Mutation($datas: SignInInput!) {
    signIn(datas: $datas) {
      id
    }
  }
`;
