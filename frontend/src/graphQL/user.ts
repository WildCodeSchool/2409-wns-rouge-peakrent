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
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const FORGOT_PASSWORD = `
  mutation ForgotPassword($data: ForgotPasswordInput!) {
    forgotPassword(data: $data)
  }
`;

export const RESET_PASSWORD = `
  mutation ResetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;

export const VERIFY_RESET_TOKEN = `
    mutation VerifyResetToken($token: String!) {
      verifyResetToken(token: $token)
    }
  `;

export const VERIFY_CONFIRM_EMAIL_TOKEN = `
    mutation VerifyConfirmEmailToken($token: String!) {
      verifyConfirmEmailToken(token: $token)
    }
  `;

export const CHANGE_EMAIL = `
  mutation ChangeEmail($data: ChangeEmailInput!) {
    changeEmail(data: $data)
  }
`;

export const CONFIRM_NEW_EMAIL = `
  mutation ConfirmNewEmail($data: ConfirmNewEmailInput!) {
    confirmNewEmail(data: $data)
  }
`;

export const CHANGE_PASSWORD = `
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;
