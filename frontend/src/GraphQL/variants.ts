export const GET_VARIANTS = `
  query GetVariants {
    getVariants {
      size
      color
    }
  }
`;

export const CREATE_VARIANT = `
mutation CreateVariant($data: VariantCreateInput!) {
  createVariant(data: $data) {
    id
  }
}
`;

export const UPDATE_VARIANT = `
mutation UpdateVariant($data: VariantUpdateInput!, $updateVariantId: ID!) {
  updateVariant(data: $data, id: $updateVariantId) {
    id
  }
}
`;
