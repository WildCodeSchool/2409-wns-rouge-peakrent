export const UPDATE_TAG = `
  mutation Mutation($data: TagUpdateInput!, $id: ID!) {
    updateTag(data: $data, id: $id) {
      id
      name
    }
  }
`;
