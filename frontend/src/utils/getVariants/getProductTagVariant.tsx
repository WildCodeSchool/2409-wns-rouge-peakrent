import { BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given name.
 *
 * @param {string} name - The name of the tag.
 * @returns {BadgeVariantType} The corresponding badge variant for the tag.
 */
export const getProductTagVariant = (name: string): BadgeVariantType => {
  switch (name) {
    case "débutant":
      return "green";
    case "intermédiaire":
      return "blue";
    case "confirmé":
      return "red";
    case "expert":
      return "black";
    case "ski":
      return "cyan";
    case "snowboard":
      return "purple";
    default:
      return "none";
  }
};
