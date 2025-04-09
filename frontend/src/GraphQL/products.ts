import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query getProducts($page: Int, $onPage: Int) {
    getProducts(page: $page, onPage: $onPage) {
      products {
        categories {
          createdAt
          name
        }
        createdAt
        description
        id
        isPublished
        name
        sku
        updatedAt
        urlImage
        variants {
          id
          size
        }
      }
    }
  }
`;
