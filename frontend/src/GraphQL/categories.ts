import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query getCategories {
    getCategories {
      id
      name
    }
  }
`;
export const GET_ALL_ADS_IN_A_CATEGORY = gql`
  query getAllAdsInACategory($param: String!) {
    getCategoryById(param: $param) {
      category {
        name
      }
      pagination {
        total
        currentPage
        totalPages
      }
      ads {
        id
        title
        picture
        price
      }
    }
  }
`;
