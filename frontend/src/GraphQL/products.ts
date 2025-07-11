export const GET_PRODUCTS = `
  query getProducts($page: Int, $onPage: Int, $search: String) {
    getProducts(page: $page, onPage: $onPage, search: $search) {
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
query GetProducts($endingDate: DateTimeISO, $startingDate: DateTimeISO, $categoryIds: [Int!], $onPage: Int!, $page: Int!) {
  getProducts(endingDate: $endingDate, startingDate: $startingDate, categoryIds: $categoryIds, onPage: $onPage, page: $page) {
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

export const GET_PRODUCT_BY_VARIANT_ID = `
  query getProductByVariantId($id: ID!) {
    getProductByVariantId(id: $id) {
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

export const CREATE_PRODUCT = `
mutation CreateProduct($data: ProductCreateInput!) {
  createProduct(data: $data) {
    id
    name
  }
}
`;

export const CREATE_PRODUCT_WITH_VARIANT = `
mutation CreateProductWithVariants($productData: ProductCreateInput!, $variants: [VariantCreateNestedInput!]) {
  createProductWithVariants(productData: $productData, variants: $variants) {
    id
    name
    variants {
      id
      color
      size
    }
  }
}
`;

export const UPDATE_PRODUCT = `
mutation UpdateProduct($updateProductId: String!, $data: ProductUpdateInput!) {
  updateProduct(id: $updateProductId, data: $data) {
    id
    name
  }
}
`;
