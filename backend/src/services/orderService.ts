import { Order } from "../entities/Order";
import {
  OrderPaymentType,
  OrderStatusType,
  StripePaymentStatusType,
} from "../types";

export const updateOrderStatusFromPayment = async (
  order: Order,
  stripeStatus: StripePaymentStatusType,
  lastPaymentError: boolean
): Promise<Order | null> => {
  let status: OrderStatusType;

  if (order.paymentMethod === OrderPaymentType.onSite) {
    return null;
  }

  if (stripeStatus === "requires_payment_method" && lastPaymentError) {
    status = OrderStatusType.failed;
  } else {
    switch (stripeStatus) {
      case "succeeded":
        status = OrderStatusType.confirmed;
        break;
      case "canceled":
        status = OrderStatusType.cancelled;
        break;
      default:
        status = OrderStatusType.pending;
    }
  }

  order.status = status;
  return await order.save();
};
