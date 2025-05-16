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
  mutation CreateActivity($data: ActivityCreateInput!) {
    createActivity(data: $data) {
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
  mutation UpdateActivity($id: ID!, $data: ActivityUpdateInput!) {
    updateActivity(id: $id, data: $data) {
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

export const DELETE_ACTIVITY = `
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id) {
      id
    }
  }
`;

export const DELETE_MULTIPLE_ACTIVITIES = `
  mutation DeleteMultipleActivities($ids: [ID!]!) {
    deleteActivities(ids: $ids)
  }
`;
