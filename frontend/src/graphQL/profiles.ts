export const GET_PROFILES_ADMIN = `
  query GetProfilesByAdmin($search: String) {
    getProfilesByAdmin(search: $search) {
      id
      email
      firstname
      lastname
      role
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_DELETED_PROFILES_ADMIN = `
  query GetDeletedProfilesByAdmin($search: String) {
    getDeletedProfilesByAdmin(search: $search) {
      id
      email
      firstname
      lastname
      role
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_PROFILE_BY_USER_ID = `
  query GetProfileByUserId($userId: ID!) {
    getProfileByUserId(userId: $userId) {
      id
      firstname
      lastname
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROFILE = `
  mutation createUserByAdmin($data: CreateUserInputAdmin!) {
    createUserByAdmin(data: $data) {
      email
      firstname
      lastname
      role
      createdAt
      updatedAt
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
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROFILE = `
mutation DeleteProfile {
  softDeleteProfile
}
`;

export const DELETE_PROFILE_BY_ADMIN = `
  mutation deleteProfileByAdmin($userId: Float!) {
    softDeleteProfileByAdmin(userId: $userId)
  }
`;

export const ANONYMISE_PROFILE = `
mutation AnonymiseProfile {
  anonymiseProfile
}
`;

export const ANONYMISE_PROFILE_BY_ADMIN = `
  mutation AnonymiseProfileByAdmin($userId: Float!) {
    anonymiseProfileByAdmin(userId: $userId)
  }
`;

export const RETRIEVE_PROFILE_BY_ADMIN = `
  mutation RetrieveAnonymisedAccount($userId: Float!) {
    retrieveAnonymisedAccount(userId: $userId)
  }
`;

export const GET_MY_PROFILE = `
  query GetMyProfile {
    getMyProfile {
      firstname
      lastname
      email
    }
  }
`;

export const UPDATE_USER_PROFILE = `
  mutation UpdateUserProfile($data: UserUpdateProfileInput!) {
    updateUserProfile(data: $data) {
      firstname
      lastname
    }
  }
`;
