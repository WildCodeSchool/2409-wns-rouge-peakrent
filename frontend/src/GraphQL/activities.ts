export const GET_ACTIVITIES = `
  query GetActivities($data: ActivityPaginationInput!) {
    getActivities(data: $data) {
      activities {
        id
        name
        normalizedName
        urlImage
        variant
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
