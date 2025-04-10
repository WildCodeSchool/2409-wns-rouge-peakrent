export const UPDATE_CATEGORY = `
  mutation Mutation($data: CategoryUpdateInput!, $id: ID!) {
    updateCategory(data: $data, id: $id) {
      id
      name
    }
  }
`;
