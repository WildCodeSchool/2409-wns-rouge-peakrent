export const GET_CATEGORIES = `
  query GetCategories {
    getCategories {
      id
      name
      normalizedName
      urlImage
      createdAt
      updatedAt
      children {
        id
        name
        normalizedName
        urlImage
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CATEGORY = `
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = `
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = `
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      image
      createdAt
      updatedAt
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

export const GET_ALL_ADS_IN_A_CATEGORY = `
  query getAllAdsInACategory($param: String!) {
    getCategoryById(param: $param) {
      category {
        name
      }
      pagination {
        total
        currentPage
        totalPages
      }
      ads {
        id
        title
        picture
        price
      }
    }
  }
`;
