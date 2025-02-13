import { gql } from "@apollo/client";

export const GET_ADS_AND_TAGS = gql`
  query getAdsAndTags($searchTerm: String!) {
    getAdsAndTags(searchTerm: $searchTerm) {
      tags {
        id
        name
      }
      ads {
        id
        title
      }
    }
  }
`;
