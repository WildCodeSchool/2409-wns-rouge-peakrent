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

// export const CREATE_PROFILE = `
//   mutation CreateProfile($input: ProfileInput!) {
//     createProfile(input: $input) {
//       id
//       email
//       firstname
//       lastname
//       role
//       createdAt
//       updatedAt
//     }
//   }
// `;

// export const UPDATE_PROFILE = `
//   mutation UpdateProfile($id: ID!, $input: ProfileInput!) {
//     updateProfile(id: $id, input: $input) {
//       id
//       email
//       firstname
//       lastname
//       role
//       createdAt
//       updatedAt
//     }
//   }
// `;

// export const DELETE_PROFILE = `
//   mutation DeleteProfile($id: ID!) {
//     deleteProfile(id: $id) {
//       id
//     }
//   }
// `;

// export const DELETE_MULTIPLE_USERS = `
//   mutation DeleteMultipleProfiles($ids: [ID!]!) {
//     deleteMultipleProfiles(ids: $ids) {
//       id
//     }
//   }
// `;
