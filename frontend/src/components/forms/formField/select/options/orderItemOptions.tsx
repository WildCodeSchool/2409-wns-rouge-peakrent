import { Badge } from "@/components/ui/badge";
import { getOrderItemStatusText, getOrderItemStatusVariant } from "@/utils";

const optionsWithVariants = [
  "pending",
  "distributed",
  "recovered",
  "cancelled",
  "refunded",
];

export const orderItemStatusOptions = optionsWithVariants.map((value) => ({
  label: value,
  value: value.toLowerCase().replace(/ /g, "_"),
  renderLabel: () => {
    const label = getOrderItemStatusText(value);
    return (
      <Badge
        variant={getOrderItemStatusVariant(value)}
        className="flex h-fit min-h-6 gap-2 rounded-lg text-sm"
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Badge>
    );
  },
}));
