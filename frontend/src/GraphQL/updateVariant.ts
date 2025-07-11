export const UPDATE_VARIANT = `
mutation UpdateVariant($data: VariantUpdateInput!, $updateVariantId: ID!) {
  updateVariant(data: $data, id: $updateVariantId) {
    id
  }
}
`;