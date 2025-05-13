import { Badge, badgeVariantList } from "@/components/ui/badge";

/**
 * Returns the available badge variant options with their labels and associated badge components.
 *
 * @returns {Array<{value: string, label: JSX.Element}>} An array of objects containing the value and label for each badge variant option.
 */

export const getBadgeVariantOptions = () => {
  const badgeVariantOptions = badgeVariantList.map((variant) => ({
    value: variant,
    label: variant.charAt(0).toUpperCase() + variant.slice(1),
    renderLabel: () => (
      <Badge
        variant={variant}
        className="text-md flex gap-2 rounded-lg px-1 capitalize flex-1"
      >
        {variant.charAt(0).toUpperCase() + variant.slice(1)}
      </Badge>
    ),
  }));

  return badgeVariantOptions;
};
