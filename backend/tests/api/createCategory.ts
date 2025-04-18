export const mutationCreateCategory = `#graphql
  mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
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
