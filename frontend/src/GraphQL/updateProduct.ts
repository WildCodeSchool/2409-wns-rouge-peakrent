export const UPDATE_PRODUCT = `
mutation UpdateProduct($updateProductId: String!, $data: ProductUpdateInput!) {
  updateProduct(id: $updateProductId, data: $data) {
    id
    name
  }
}
`;
