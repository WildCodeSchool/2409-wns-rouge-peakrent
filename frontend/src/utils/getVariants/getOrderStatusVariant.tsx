import { BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given order status.
 *
 * @param {string} name - The name of the order status.
 * @returns {BadgeVariantType} The corresponding badge variant for the order status.
 */
export const getOrderStatusVariant = (name: string): BadgeVariantType => {
  switch (name) {
    case "pending":
      return "blue";
    case "confirmed":
      return "yellow";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    case "refunded":
      return "orange";
    default:
      return "black";
  }
};

export const getOrderStatusText = (name: string): string => {
  switch (name) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "completed":
      return "Terminé";
    case "cancelled":
      return "Annulée";
    case "refunded":
      return "Remboursée";
    default:
      return "Erreur";
  }
};
