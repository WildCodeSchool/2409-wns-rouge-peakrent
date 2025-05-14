import { Product as ProductType } from "@/gql/graphql";

/**
 * Calculates the price range of a product taking into account variants and discounts
 * @param product - The product to calculate the price range for
 * @param isDiscounted - Whether to apply the discount
 * @returns The formatted price range or null if the product has no variants
 */

//TODO remove & { discount: number } when discount is implemented

export function getPriceRange(
  product: ProductType & { discount: number },
  isDiscounted: boolean = false
) {
  if (!product.variants || product.variants.length === 0) return null;

  const discount = isDiscounted ? (product.discount ?? 0) : 0;

  const prices = product.variants.map(
    (variant) => variant.pricePerHour * (1 - discount / 100)
  );
  const minPrice = (Math.min(...prices) / 100).toFixed(2);
  const maxPrice = (Math.max(...prices) / 100).toFixed(2);

  return minPrice === maxPrice ? minPrice : `${minPrice}-${maxPrice}`;
}
