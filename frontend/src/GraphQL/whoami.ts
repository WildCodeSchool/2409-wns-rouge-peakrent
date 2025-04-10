import { gql } from "@apollo/client/core";

export const WHOAMI = gql`
  query Whoami {
    whoami {
      id
      email
      role
    }
  }
`;
