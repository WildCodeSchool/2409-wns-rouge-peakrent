import { BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given order status.
 *
 * @param {string} status - The status of the order.
 * @returns {BadgeVariantType} The corresponding badge variant for the order status.
 */
export const getStatusBadgeVariant = (status: string): BadgeVariantType => {
  switch (status) {
    case "pending":
      return "blueDark";
    case "confirmed":
      return "default";
    case "completed":
      return "green";
    case "cancelled":
      return "destructive";
    case "refunded":
      return "secondary";
    default:
      return "none";
  }
};
