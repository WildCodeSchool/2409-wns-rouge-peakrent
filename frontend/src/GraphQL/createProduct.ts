export const CREATE_PRODUCT = `
mutation CreateProduct($data: ProductCreateInput!) {
  createProduct(data: $data) {
    id
    name
  }
}
`;
export const CREATE_PRODUCT_WITH_VARIANT = `
mutation CreateProductWithVariants($productData: ProductCreateInput!, $variants: [VariantCreateNestedInput!]) {
  createProductWithVariants(productData: $productData, variants: $variants) {
    id
    name
    variants {
      id
      color
      size
    }
  }
}
`;
// {
//   "productData": {
//     "name": "null",
//     "description": "null",
//     "urlImage": "null",
//     "isPublished": true,
//     "sku": "null",
//     "categories": [
//       {
//         "id": "1"
//       }
//     ]
//   },
//   "variants": [
//     {
//       "size": "null",
//       "color": "null",
//       "pricePerHour": 127848
//     }
//   ]
// }
