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
