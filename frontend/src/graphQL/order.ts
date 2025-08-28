export const CREATE_ORDER = `
  mutation Mutation($data: OrderCreateInputAdmin!) {
    createOrderAdmin(data: $data) {
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
      reference
      status
      paymentMethod
      address1
      address2
      city
      country
      zipCode
      date
      paidAt
      createdAt
      updatedAt
      discountAmount
      chargedAmount
      voucher {
        id
        code
        type
        amount
        isActive
        startsAt
        endsAt
      }
      profile {
        id
        email
        firstname
        lastname
      }
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

export const GET_ORDERS_ADMIN = `
  query getOrdersAdmin {
    getOrdersAdmin {
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

export const GET_MY_ORDERS = `
  query getMyOrders {
    getMyOrders {
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
      }
        orderItems {
        id
        quantity
        pricePerHour
        startsAt
        endsAt
        status
        variant {
          id
          size
          pricePerHour
          product {
            id
            name
            sku
            urlImage
          }
        }
      }
    }
  }
`;
