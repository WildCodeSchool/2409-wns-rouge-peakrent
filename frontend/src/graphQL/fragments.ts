// Fragments réutilisables
export const ALL_PROFILE_FIELDS = `
  fragment AllProfileFields on Profile {
    email
    firstname
    lastname
    id
    role
    createdAt
    updatedAt
  }
`;

export const BASIC_PROFILE_FIELDS = `
  fragment BasicProfileFields on Profile {
    email
    firstname
    lastname
    id
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
  }
`;

export const ORDER_WITH_ITEMS_FIELDS_ADMIN = `
  fragment OrderWithItemsFieldsAdmin on Order {
    ...OrderFields
    profile {
      ...AllProfileFields
    }
    orderItems {
      ...OrderItemFields
    }
  }
  ${ORDER_FIELDS}
  ${ALL_PROFILE_FIELDS}
  ${ORDER_ITEM_FIELDS}
`;

export const ORDER_WITH_ITEMS_FIELDS_USER = `
  fragment OrderWithItemsFieldsUser on Order {
    ...OrderFields
    profile {
      ...BasicProfileFields
    }
    orderItems {
      ...OrderItemFields
    }
  }
  ${ORDER_FIELDS}
  ${BASIC_PROFILE_FIELDS}
  ${ORDER_ITEM_FIELDS}
`;
