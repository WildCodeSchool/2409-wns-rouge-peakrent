export const mutationCreateCategory = `#graphql
  mutation CreateCategoryAdmin($data: CategoryCreateInputAdmin!) {
    createCategoryAdmin(data: $data) {
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
