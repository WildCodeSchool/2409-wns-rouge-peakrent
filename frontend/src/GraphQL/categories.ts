export const GET_CATEGORIES = `
  query GetCategories($data: CategoryPaginationInput!) {
    getCategories(data: $data) {
      categories {
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
  }
`;

export const GET_CATEGORY = `
  query GetCategory($id: ID!) {
    getCategoryById(id: $id) {
      id
      name
      normalizedName
      variant
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = `
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

export const UPDATE_CATEGORY = `
  mutation UpdateCategory($id: ID!, $data: CategoryUpdateInput!) {
    updateCategory(id: $id, data: $data) {
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

export const DELETE_CATEGORY = `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const DELETE_MULTIPLE_CATEGORIES = `
  mutation DeleteMultipleCategories($ids: [ID!]!) {
    deleteCategories(ids: $ids)
  }
`;
