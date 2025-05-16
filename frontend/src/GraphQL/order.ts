export const CREATE_ORDER = `
  mutation Mutation($data: OrderCreateInput!) {
    createOrder(data: $data) {
      address1
      address2
      city
      country
      createdAt
      id
      paymentMethod
      reference
      status
      updatedAt
      zipCode
    }
  }
`;

export const GET_ORDER_BY_ID = `
  query GetOrderById($getOrderByIdId: ID!) {
    getOrderById(id: $getOrderByIdId) {
      id
      address1
      address2
      city
      country
      reference
      zipCode
      paymentMethod
      profile {
        id
        email
        firstname
        lastname
      }
      createdAt
      updatedAt
      paidAt
      orderItems {
        id
        startsAt
        endsAt
        quantity
        pricePerHour
        createdAt
        updatedAt
        status
        variant {
          id
          pricePerHour
          size
          color
          product {
            id
            sku
            urlImage
            name
          }
        }
      }
    }
  }
`;

export const GET_ORDERS = `
  query getOrders {
    getOrders {
      id
      reference
      status
      paymentMethod
      paidAt
      address1
      address2
      country
      city
      zipCode
      createdAt
      updatedAt
      profile {
        email
        firstname
        lastname
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ORDER = `
  mutation UpdateOrder($id: Int!, $data: UpdateOrderInput!) {
    updateOrder(id: $id, data: $data) {
      id
      status
      total
      createdAt
      updatedAt
      user {
        id
        email
      }
      store {
        id
        name
      }
      order_items {
        id
        quantity
        price
        product {
          id
          name
        }
      }
    }
  }
`;
