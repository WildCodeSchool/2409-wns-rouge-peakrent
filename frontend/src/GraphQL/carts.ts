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

export const GET_CART_BY_USER = `
query GetCartForUser($withOrderItems: Boolean!) {
  getCartForUser(withOrderItems: $withOrderItems) {
    id
    address1
    address2
    zipCode
    city
    country
    orderItems {
      id
      quantity
      pricePerHour
      startsAt
      endsAt
      variant {
        color
        id
        pricePerHour
        product {
          description
          name
          sku
          urlImage
          id
        }
        size
      }
    }
  }
}
`;

export const UPDATE_CART_USER = `
  mutation Mutation($data: CartUpdateInputUser!) {
    updateCartUser(data: $data) {
      address1
      address2
      city
      country
      zipCode
    }
  }
`;

export const VALIDATE_CART = `
mutation Mutation($data: ValidateCartInput!) {
  validateCartUser(data: $data) {
    reference
  }
}
`;
