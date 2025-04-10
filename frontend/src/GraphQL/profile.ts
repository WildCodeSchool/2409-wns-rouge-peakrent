import { gql } from "@apollo/client";

export const GET_PROFILE_BY_USER_ID = gql`
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
