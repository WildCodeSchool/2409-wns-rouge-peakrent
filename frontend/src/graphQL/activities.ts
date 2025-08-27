export const GET_ACTIVITIES = `
  query GetActivities($data: ActivityPaginationInput!) {
    getActivities(data: $data) {
      activities {
        id
        name
        normalizedName
        urlImage
        variant
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ACTIVITY = `
  query GetActivity($id: ID!) {
    getActivityById(id: $id) {
      id
      name
      normalizedName
      urlImage
      variant
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ACTIVITY = `
  mutation CreateActivityAdmin($data: ActivityCreateInputAdmin!) {
    createActivityAdmin(data: $data) {
      id
      name
      normalizedName
      urlImage
      variant
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ACTIVITY = `
  mutation UpdateActivityAdmin($id: ID!, $data: ActivityUpdateInputAdmin!) {
    updateActivityAdmin(id: $id, data: $data) {
      id
      name
      normalizedName
      urlImage
      variant
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_MULTIPLE_ACTIVITIES = `
  mutation DeleteMultipleActivitiesAdmin($ids: [ID!]!) {
    deleteActivitiesAdmin(ids: $ids)
  }
`;

export const GET_ACTIVITY_BY_NORMALIZED_NAME = `
  query GetActivityByNormalizedName($normalizedName: String!) {
    getActivityByNormalizedName(normalizedName: $normalizedName) {
      id
      name
      normalizedName
      urlImage
      variant
      description
      createdAt
      updatedAt
      products {
        id
        name
        description
        urlImage
        sku
        isPublished
        categories {
          id
          name
          variant
        }
        variants {
          id
          size
          color
          pricePerDay
        }
      }
    }
  }
`;
