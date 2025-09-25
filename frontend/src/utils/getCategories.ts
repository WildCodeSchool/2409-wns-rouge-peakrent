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
  const categories = product.categories ?? [];
  const map = new Map<string, CategoryType>();
  for (const category of categories) {
    if (!map.has(category.id)) map.set(category.id, category);
  }
  return Array.from(map.values());
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
