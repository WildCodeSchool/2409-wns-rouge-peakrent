import { gql } from "@apollo/client";

export const WHOAMI = gql`
  query Whoami {
    whoami {
      id
    }
  }
`;
