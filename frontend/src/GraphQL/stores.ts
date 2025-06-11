export const GET_STORES = `
  query getStores {
    getStores {
      id
      name
      phoneNumber
      address1
      address2
      city
      zipCode
      country
      reference
      createdAt
      updatedAt
    }
  }
`;

export const GET_STORE_BY_ID = `
query GetStoreById($param: String!) {
    getStoreById(param: $param) {
      address1
      address2
      city
      country
      zipCode
    }
  }
`;
