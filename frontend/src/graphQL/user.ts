export const CREATE_USER = `
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
