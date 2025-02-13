import { gql } from "@apollo/client";

export const GET_MINIMAL_ADS_WITH_PAGING = gql`
  query GetAds($onPage: Int!, $page: Int!) {
    getAds(onPage: $onPage, page: $page) {
      ads {
        id
        title
        price
        picture
      }
      pagination {
        total
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_AD_BY_ID = gql`
  query GetAd($param: String!) {
    getAdById(param: $param) {
      id
      title
      author
      description
      owner
      price
      picture
      location
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;
