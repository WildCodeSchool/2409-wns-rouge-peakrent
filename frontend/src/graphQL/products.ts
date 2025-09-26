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
        activities {
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
          pricePerDay
          isPublished
        }
      }
    }
  }
`;

export const GET_PUBLISHED_PRODUCTS_WITH_PAGING = `
  query GetPublishedProducts(
    $endingDate: DateTimeISO
    $startingDate: DateTimeISO
    $categoryIds: [Int!]
    $activityIds: [Int!]
    $onPage: Int!
    $page: Int!
    $search: String
  ) {
    getPublishedProducts(
      endingDate: $endingDate
      startingDate: $startingDate
      categoryIds: $categoryIds
      activityIds: $activityIds
      onPage: $onPage
      page: $page
      search: $search
    ) {
      products {
        id
        isPublished
        name
        sku
        urlImage
        description
        createdAt
        categories { id name variant }
        activities { id name }
        variants { id size color pricePerDay isPublished }
      }
      pagination {
        total
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_PRODUCTS_ADMIN = `
  query GetProductsAdmin(
    $page: Int, $onPage: Int,
    $categoryIds: [Int!], $activityIds: [Int!],
    $search: String
  ) {
    getProductsAdmin(
      page: $page, onPage: $onPage,
      categoryIds: $categoryIds, activityIds: $activityIds,
      search: $search
    ) {
      products {
        id
        isPublished
        name
        sku
        urlImage
        description
        createdAt
        categories { id name variant }
        activities { id name }
        variants { id size color pricePerDay isPublished }
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
        pricePerDay
        isPublished
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
      activities {
        id
        name
        variant
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
        pricePerDay
        isPublished
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
mutation CreateProduct($data: ProductCreateInputAdmin!) {
  createProductAdmin(data: $data) {
    id
    name
  }
}
`;

export const CREATE_PRODUCT_WITH_VARIANT = `
mutation CreateProductWithVariants($productData: ProductCreateInputAdmin!, $variants: [VariantCreateNestedInputAdmin!]) {
  createProductWithVariantsAdmin(productData: $productData, variants: $variants) {
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
mutation UpdateProduct($updateProductId: String!, $data: ProductUpdateInputAdmin!) {
  updateProductAdmin(id: $updateProductId, data: $data) {
    id
    name
  }
}
`;
