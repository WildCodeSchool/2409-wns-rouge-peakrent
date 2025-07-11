export const CREATE_VARIANT = `
mutation CreateVariant($data: VariantCreateInput!) {
  createVariant(data: $data) {
    id
  }
}
`;
