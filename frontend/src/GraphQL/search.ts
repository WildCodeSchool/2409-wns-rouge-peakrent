export const GET_PRODUCTS_AND_CATEGORIES = `
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
