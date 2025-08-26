// Fragments réutilisables
export const PROFILE_FIELDS = `
  fragment ProfileFields on Profile {
    email
    firstname
    lastname
    id
    role
    createdAt
    updatedAt
  }
`;

export const VARIANT_PRODUCT_FIELDS = `
  fragment VariantProductFields on Variant {
    id
    size
    pricePerHour
    color
    product {
      id
      sku
      urlImage
      name
      description
    }
  }
`;

export const ORDER_ITEM_FIELDS = `
  fragment OrderItemFields on OrderItem {
    id
    startsAt
    endsAt
    quantity
    pricePerHour
    status
    createdAt
    updatedAt
    variant {
      ...VariantProductFields
    }
  }
  ${VARIANT_PRODUCT_FIELDS}
`;

export const ORDER_FIELDS = `
  fragment OrderFields on Order {
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
      ...ProfileFields
    }
    orderItems {
      ...OrderItemFields
    }
  }
  ${PROFILE_FIELDS}
  ${ORDER_ITEM_FIELDS}
`;
