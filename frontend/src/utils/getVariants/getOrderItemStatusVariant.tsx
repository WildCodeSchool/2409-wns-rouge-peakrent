import { BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given order status.
 *
 * @param {string} name - The name of the order status.
 * @returns {BadgeVariantType} The corresponding badge variant for the order status.
 */
export const getOrderItemStatusVariant = (name: string): BadgeVariantType => {
  switch (name) {
    case "pending":
      return "blue";
    case "distributed":
      return "yellow";
    case "recovered":
      return "green";
    case "cancelled":
      return "red";
    case "refunded":
      return "orange";
    case "confirmed":
      return "green";
    default:
      return "black";
  }
};

export const getOrderItemStatusText = (name: string): string => {
  switch (name) {
    case "pending":
      return "En attente de paiement";
    case "inProgress":
      return "En cours de location";
    case "distributed":
      return "Distribué";
    case "recovered":
      return "Récupéré";
    case "cancelled":
      return "Annulé";
    case "refunded":
      return "Remboursé";
    case "confirmed":
      return "Confirmé";
    default:
      return "Erreur";
  }
};
