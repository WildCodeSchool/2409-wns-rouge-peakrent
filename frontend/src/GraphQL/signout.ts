import { gql } from "@apollo/client/core";

export const SIGNOUT = gql`
  mutation Mutation {
    signOut
  }
`;
