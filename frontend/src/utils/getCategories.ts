import {
  Category as CategoryType,
  Product as ProductType,
} from "@/gql/graphql";

/**
 * Retrieves all category names of a product, including child categories
 * @param product - The product to get categories from
 * @returns An array of category names or null if the product has no categories
 */
export function getCategories(product: ProductType) {
  if (!product.categories || product.categories.length === 0) return null;

  const allCategoryNames = product.categories.flatMap(
    (category: CategoryType) => getAllCategoryNames(category)
  );

  return [...new Set(allCategoryNames)];
}

/**
 * Recursive function that retrieves all category names of a category and its children
 * @param category - The category to get names from
 * @returns An array of category names
 */
function getAllCategoryNames(category: CategoryType): string[] {
  const names = [category.name];
  if (category.childrens && category.childrens.length > 0) {
    category.childrens.forEach((child) => {
      names.push(...getAllCategoryNames(child));
    });
  }
  return names;
}
