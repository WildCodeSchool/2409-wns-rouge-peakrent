export const CREATE_TAG = `
  mutation Mutation($data: TagCreateInput!) {
    createTag(data: $data) {
      id
      name
    }
  }
`;
