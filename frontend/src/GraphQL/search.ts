import { gql } from "@apollo/client";

export const GET_PRODUCTS_AND_CATEGORIES = gql`
  query GetProductsAndCategories($searchTerm: String!) {
    getProductsAndCategories(searchTerm: $searchTerm) {
      categories {
        id
        name
      }
      products {
        id
        name
      }
    }
  }
`;
