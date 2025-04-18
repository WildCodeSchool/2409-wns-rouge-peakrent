export const GET_PRODUCTS = `
  query getProducts($page: Int, $onPage: Int) {
    getProducts(page: $page, onPage: $onPage) {
      products {
        categories {
          id
          createdAt
          name
          variant
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
          color
          pricePerHour
        }
      }
    }
  }
`;

export const GET_MINIMAL_PRODUCTS_WITH_PAGING = `
  query GetProducts($onPage: Int!, $page: Int!, $categoryIds: [Int!]) {
    getProducts(onPage: $onPage, page: $page, categoryIds: $categoryIds) {
      products {
        id
        isPublished
        name
        sku
        urlImage
        description
        createdAt
        categories {
          id
          name
          variant
        }
        variants {
          pricePerHour
        }
      }
      pagination {
        total
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = `
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
        variant
        parentCategory {
          id
          name
          variant
        }
      }
    }
  }
`;
