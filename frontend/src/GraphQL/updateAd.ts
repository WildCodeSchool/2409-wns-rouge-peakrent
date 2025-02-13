import { gql } from "@apollo/client";

export const UPDATE_AD = gql`
  mutation Mutation($data: AdUpdateInput!, $id: String!) {
    updateAd(data: $data, id: $id) {
      id
    }
  }
`;
