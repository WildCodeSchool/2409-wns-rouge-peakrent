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

export const UPDATE_CATEGORY = `
  mutation UpdateCategoryAdmin($id: ID!, $data: CategoryUpdateInputAdmin!) {
    updateCategoryAdmin(id: $id, data: $data) {
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
  mutation DeleteCategoryAdmin($id: ID!) {
    deleteCategoryAdmin(id: $id) {
      id
    }
  }
`;

export const DELETE_MULTIPLE_CATEGORIES = `
  mutation DeleteMultipleCategoriesAdmin($ids: [ID!]!) {
    deleteCategoriesAdmin(ids: $ids)
  }
`;
