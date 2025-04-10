export const SIGNIN = `
  mutation Mutation($datas: SignInInput!) {
    signIn(datas: $datas) {
      id
    }
  }
`;
