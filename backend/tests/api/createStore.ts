export const mutationCreateStore = `#graphql
  mutation createStoreAdmin($data: StoreCreateInputAdmin!) {
    createStoreAdmin(data: $data) {
      id
    }
  }
`;
