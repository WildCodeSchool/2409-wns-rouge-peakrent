export const mutationCreateCategory = `#graphql
  mutation CreateCategory($input: CategoryCreateInput!) {
    createCategory(input: $input) {
      id
      name
      normalizedName
      variant
      createdAt
      updatedAt
      parentCategory {
        id
      }
      childrens {
        id
        name
        normalizedName
        variant
        createdAt
        updatedAt
      }
    }
  }
`;
