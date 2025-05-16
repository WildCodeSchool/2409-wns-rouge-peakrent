export const GET_CARTS = `
  query GetCarts {
    getCarts {
    id
    address1
    address2
    zipCode
    city
    country
    profile {
      id
      email
      firstname
      lastname
      role
    }
    orderItems {
      id
      pricePerHour
      quantity
      startsAt
      endsAt
      variant {
        id
        size
        color
        pricePerHour
        product {
          id
          name
          sku
          urlImage
          categories {
            id
            name
            variant
          }
          activities {
            id
            name
            variant
          }
        }
      }
    }
    createdAt,
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
