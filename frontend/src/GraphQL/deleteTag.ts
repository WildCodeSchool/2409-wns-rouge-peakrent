export const DELETE_TAG = `
  mutation Mutation($id: ID!) {
    deleteTag(id: $id) {
      name
    }
  }
`;
