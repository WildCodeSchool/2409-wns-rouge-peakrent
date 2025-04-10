export const DELETE_AD = `
  mutation Mutation($id: ID!) {
    deleteAd(id: $id) {
      title
    }
  }
`;
