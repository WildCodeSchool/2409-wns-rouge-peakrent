export const mutationCreateStore = `#graphql
  mutation createStore($data: StoreCreateInput!) {
    createStore(data: $data) {
      id
    }
  }
`;
