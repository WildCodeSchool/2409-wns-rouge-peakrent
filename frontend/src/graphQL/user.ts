export const GET_USERS_ADMIN = `
query GetUsersByAdmin($search: String) {
  getUsersByAdmin(search: $search) {
    id
    email
    emailVerifiedAt
    firstname
    lastname
    role
    emailSentAt
    recoverToken
    recoverSentAt
    emailToken
    createdAt
    updatedAt
    deletedAt
  }
}
`;

export const GET_DELETED_USERS_ADMIN = `
query GetDeletedUsersByAdmin($search: String) {
  getUsersByAdmin(search: $search) {
    id
    email
    emailVerifiedAt
    firstname
    lastname
    role
    emailSentAt
    recoverToken
    recoverSentAt
    emailToken
    createdAt
    updatedAt
    deletedAt
  }
}
`;

export const CREATE_USER = `
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
