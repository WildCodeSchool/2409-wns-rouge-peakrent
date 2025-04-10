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
