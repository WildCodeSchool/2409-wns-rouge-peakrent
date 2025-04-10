export const CREATE_CATEGORY = `
  mutation Mutation($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
      name
    }
  }
`;
