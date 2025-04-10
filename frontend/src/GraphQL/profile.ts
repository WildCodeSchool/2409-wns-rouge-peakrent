export const GET_PROFILE_BY_USER_ID = `
  query GetProfileByUserId($userId: ID!) {
    getProfileByUserId(userId: $userId) {
      id
      firstname
      lastname
      email
      role
    }
  }
`;
