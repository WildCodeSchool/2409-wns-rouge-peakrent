import { Badge, BadgeVariantType } from "@/components/ui/badge";

/**
 * Returns the associated badge variant with a given payment status.
 *
 * @param {boolean} isPaid - Whether the order is paid or not.
 * @returns {BadgeVariantType} The corresponding badge variant for the payment status.
 */
export const getPaymentStatusVariant = (isPaid: boolean): BadgeVariantType => {
  return isPaid ? "green" : "red";
};

export const getPaymentStatusText = (isPaid: boolean): string => {
  return isPaid ? "Payée" : "Non payée";
};

export const getPaymentStatusOptionsLabels = () => {
  const BadgePaymentStatus = ({ value }: { value: string }) => {
    const isPaid = value === "paid";
    return (
      <Badge
        variant={getPaymentStatusVariant(isPaid)}
        className="text-md flex gap-2 rounded-lg px-1 capitalize"
      >
        {getPaymentStatusText(isPaid)}
      </Badge>
    );
  };

  return [
    { value: "paid", label: <BadgePaymentStatus value="paid" /> },
    { value: "unpaid", label: <BadgePaymentStatus value="unpaid" /> },
  ];
};
