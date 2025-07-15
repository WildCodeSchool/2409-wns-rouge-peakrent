export const CREATE_USER = `
  mutation Mutation($data: UserCreateInput!) {
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
