import { gql } from "@apollo/client";

export const GET_MINIMAL_PRODUCTS_WITH_PAGING = gql`
  query GetProducts($onPage: Int!, $page: Int!) {
    getProducts(onPage: $onPage, page: $page) {
      products {
        id
        name
        urlImage
        isPublished
      }
      pagination {
        total
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query Query($param: String!) {
    getProductById(param: $param) {
      id
      name
      description
      urlImage
      isPublished
      sku
      variants {
        id
        size
        color
        pricePerHour
      }
      categories {
        id
        name
        urlImage
        parentCategory {
          id
          name
          urlImage
        }
      }
    }
  }
`;
