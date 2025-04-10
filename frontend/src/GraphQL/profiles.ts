import { gql } from "@apollo/client";

export const GET_PROFILES = gql`
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

export const GET_PROFILE = gql`
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

// export const CREATE_PROFILE = gql`
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

// export const UPDATE_PROFILE = gql`
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

// export const DELETE_PROFILE = gql`
//   mutation DeleteProfile($id: ID!) {
//     deleteProfile(id: $id) {
//       id
//     }
//   }
// `;

// export const DELETE_MULTIPLE_USERS = gql`
//   mutation DeleteMultipleProfiles($ids: [ID!]!) {
//     deleteMultipleProfiles(ids: $ids) {
//       id
//     }
//   }
// `;
