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
