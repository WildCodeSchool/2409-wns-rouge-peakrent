import { OrderItem } from "@/entities/OrderItem";
import { generateOrderItemStatusFromOrderStatus } from "@/helpers/generateOrderItemStatus";
import { Order } from "../entities/Order";
import { OrderStatusType, StripePaymentStatusType } from "../types";

export const updateOrderStatusFromPayment = async (
  order: Order,
  stripeStatus: StripePaymentStatusType,
  lastPaymentError: boolean
): Promise<Order | null> => {
  let status: OrderStatusType = OrderStatusType.pending;

  if (!order.paidAt) {
    try {
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

      const orderItems = await OrderItem.find({
        where: { order: { id: order.id } },
      });

      if (orderItems.length > 0) {
        await Promise.all(
          orderItems.map(async (item) => {
            item.status = generateOrderItemStatusFromOrderStatus(status);
            await item.save();
          })
        );
      }

      order.status = status;
      order.paidAt = status === OrderStatusType.confirmed ? new Date() : null;
      return await order.save();
    } catch (error) {
      console.error("error during payment status update", error);
    }
  }
};
