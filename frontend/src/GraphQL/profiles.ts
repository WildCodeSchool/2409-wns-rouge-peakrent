export const GET_PROFILES = `
  query GetProfiles {
    getProfiles {
      id
      email
      firstname
      lastname
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROFILE = `
  query GetProfile {
    getProfile {
      id
      email
      firstname
      lastname
      role
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROFILE = `
  mutation createUserByAdmin($data: AdminCreateUserInput!) {
    createUserByAdmin(data: $data) {
      email
      firstname
      lastname
      role
    }
  }
`;

export const UPDATE_PROFILE = `
  mutation UpdateUserByAdmin($data: AdminUpdateUserInput!, $id: ID!) {
    updateUserByAdmin(data: $data, id: $id) {
      email
      firstname
      lastname
      role
    }
  }
`;

export const DELETE_PROFILE = `
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

// export const DELETE_MULTIPLE_USERS = `
//   mutation DeleteMultipleProfiles($ids: [ID!]!) {
//     deleteMultipleProfiles(ids: $ids) {
//       id
//     }
//   }
// `;
