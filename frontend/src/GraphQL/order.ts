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
      date
      phone
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
      date
      phone
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
      orderItems {
        id
        startsAt
        endsAt
        quantity
        pricePerHour
      }
    }
  }
`;

export const UPDATE_ORDER = `
  mutation UpdateOrder($id: Int!, $data: UpdateOrderInput!) {
    updateOrder(id: $id, data: $data) {
      id
      reference
      status
      paymentMethod
      paidAt
      address1
      address2
      date
      phone
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
      orderItems {
        id
        startsAt
        endsAt
        quantity
        pricePerHour
        status
        variant {
          id
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

export const CREATE_ORDER_WITH_ITEMS = `
  mutation CreateOrderWithItems($data: OrderCreateInput!, $items: [OrderItemsFormInput!]!) {
    createOrderWithItems(data: $data, items: $items) {
      id
      reference
      status
      paymentMethod
      paidAt
      address1
      address2
      date
      phone
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
      orderItems {
        id
        startsAt
        endsAt
        quantity
        pricePerHour
        status
        variant {
          id
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
