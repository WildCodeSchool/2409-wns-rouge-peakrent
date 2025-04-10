import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
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

export const GET_CATEGORY = gql`
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

export const CREATE_CATEGORY = gql`
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

export const UPDATE_CATEGORY = gql`
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

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const DELETE_MULTIPLE_CATEGORIES = gql`
  mutation DeleteMultipleCategories($ids: [ID!]!) {
    deleteMultipleCategories(ids: $ids) {
      id
    }
  }
`;

export const GET_ALL_ADS_IN_A_CATEGORY = gql`
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
