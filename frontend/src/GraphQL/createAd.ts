export const CREATE_AD = `
  mutation Mutation($data: AdCreateInput!) {
    createAd(data: $data) {
      id
    }
  }
`;
