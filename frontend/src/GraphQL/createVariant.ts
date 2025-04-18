export const CREATE_VARIANT = `
mutation CreateVariant($data: VariantCreateInput!) {
  createVariant(data: $data) {
    id
  }
}
`;
// {
//   "data": {
//     "productId": 1,
//     "color": "gris",
//     "size": "XL",
//     "pricePerHour": 10000
//   }
// }
