import { gql } from "@apollo/client";

export const SIGNOUT = gql`
  mutation Mutation {
    signOut
  }
`;
