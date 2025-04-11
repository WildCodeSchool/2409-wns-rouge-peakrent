import { BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given category name.
 *
 * @param {string} name - The name of the category.
 * @returns {BadgeVariantType} The corresponding badge variant for the category.
 */
export const getProductCategoryVariant = (name: string): BadgeVariantType => {
  switch (name) {
    case "débutant":
      return "green";
    case "medium":
      return "blue";
    case "confirmé":
      return "red";
    case "expert":
      return "black";
    case "ski":
      return "cyan";
    case "snowboard":
      return "purple";
    case "ski alpin":
      return "orange";
    case "raquettes":
      return "teal";
    default:
      return "none";
  }
};
