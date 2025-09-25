import { Badge, BadgeVariantType } from "@/components/ui/badge";

export const orderStatusEnum = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "refunded",
];

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
      return "yellow";
    case "inProgress":
      return "orange";
    default:
      return "black";
  }
};

export const getOrderStatusText = (name: string): string => {
  switch (name) {
    case "pending":
      return "En attente de paiement";
    case "inProgress":
      return "En cours de location";
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

export const getOrderStatusOptionsLabels = () => {
  const BadgeOrderStatus = ({ value }: { value: string }) => {
    return (
      <Badge
        variant={getOrderStatusVariant(value)}
        className="text-md flex gap-2 rounded-lg px-1 capitalize"
      >
        {getOrderStatusText(value)}
      </Badge>
    );
  };

  return orderStatusEnum.map((value) => ({
    value: value,
    label: <BadgeOrderStatus value={value} />,
  }));
};
