export const GET_CATEGORIES = `
  query GetCategories($input: CategoryPaginationInput!) {
    getCategories(input: $input) {
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

export const GET_CATEGORIES_WITH_COUNT = `
  query GetCategories($page: Int, $onPage: Int) {
    getCategories(page: $page, onPage: $onPage) {
      categories {
        id
        name
        normalizedName
        variant
        createdAt
        updatedAt
      }
      pagination {
        total
        currentPage
        totalPages
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

export const UPDATE_CATEGORY = `
  mutation UpdateCategory($id: ID!, $input: CategoryUpdateInput!) {
    updateCategory(_id: $id, input: $input) {
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
    deleteMultipleCategories(ids: $ids) {
      id
    }
  }
`;
