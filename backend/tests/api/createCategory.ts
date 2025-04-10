export const mutationCreateCategory = `#graphql
  mutation Mutation($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
      name
    }
  }
`;
