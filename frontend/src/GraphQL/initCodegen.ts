import { gql } from "@apollo/client";

export const INIT_CODEGEN = gql`
  query Whoami {
    whoami {
      id
    }
  }
`;
