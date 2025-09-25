export const GET_VARIANTS = `
  query GetVariants {
    getVariants {
      size
      color
    }
  }
`;

export const CREATE_VARIANT = `
mutation CreateVariant($data: VariantCreateInputAdmin!) {
  createVariant(data: $data) {
    id
  }
}
`;

export const UPDATE_VARIANT = `
mutation UpdateVariant($data: VariantUpdateInputAdmin!, $updateVariantId: ID!) {
  updateVariant(data: $data, id: $updateVariantId) {
    id
  }
}
`;

export const DELETE_VARIANT = `
mutation DeleteVariant($id: ID!) {
  deleteVariant(id: $id)
}
`;

export const TOGGLE_VARIANT_PUBLICATION = `
mutation ToggleVariantPublication($id: ID!) {
  toggleVariantPublication(id: $id) {
    id
    isPublished
  }
}
`;
