export const CREATE_PRODUCT = `
mutation CreateProduct($data: ProductCreateInput!) {
  createProduct(data: $data) {
    id
    name
  }
}
`;
