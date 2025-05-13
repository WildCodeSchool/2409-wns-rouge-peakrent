export const GET_CARTS = `
  query GetCarts {
    getCarts {
      id
      profile {
        id
        email
        firstname
        lastname
        role
        createdAt
        updatedAt
      }
      address1
      address2
      country
      city
      zipCode
      createdAt
      updatedAt
    }
  }
`;

export const GET_CART_BY_PROFILE_ID = `
  query GetCartByProfile($profileId: Int!) {
    getCartByProfile(profileId: $profileId) {
      id
    }
  }
`;

export const CREATE_CART = `
  mutation CreateCart($data: CartCreateInput!) {
    createCart(data: $data) {
      id
    }
  }
`;
