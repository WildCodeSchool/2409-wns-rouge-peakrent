export const DELETE_CATEGORY = `
  mutation Mutation($id: ID!) {
    deleteCategory(id: $id) {
      name
    }
  }
`;
