export const UPDATE_AD = `
  mutation Mutation($data: AdUpdateInput!, $id: String!) {
    updateAd(data: $data, id: $id) {
      id
    }
  }
`;
