export const GET_VARIANT_QUANTITY_AVAILABLE = `
query checkVariantStock($storeId: Float!, $variantId: Float!, $startingDate: DateTimeISO!, $endingDate: DateTimeISO!) {
    checkVariantStock(storeId: $storeId, variantId: $variantId, startingDate: $startingDate, endingDate: $endingDate)
  }
`;
