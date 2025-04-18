export const UPDATE_VARIANT = `
mutation UpdateVariant($data: VariantUpdateInput!, $updateVariantId: ID!) {
  updateVariant(data: $data, id: $updateVariantId) {
    id
  }
}
`;
// {  "data": {
//   "size": "L",
//   "color": "black",
//   "pricePerHour": 100000,
//   "productId": 1
// },
// "updateVariantId": "1"
// }
