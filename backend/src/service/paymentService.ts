import { dataSource } from "@/config/db";
import { Payment } from "@/entities/Payment";
import { OrderStatusType, StripePaymentStatusType } from "@/types";
import { GraphQLError } from "graphql";
import Stripe from "stripe";

export const updatePaymentAndOrder = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<Payment> => {
  const payment = await Payment.findOne({
    where: { stripePaymentIntentId: paymentIntent.id },
    relations: { order: true },
  });
  if (!payment) {
    throw new GraphQLError("payment not found", {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
        entity: "payment",
      },
    });
  }

  const order = payment.order;
  if (!order) {
    throw new GraphQLError("order not found", {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
        entity: "order",
      },
    });
  }

  if (order === null) {
    throw new GraphQLError("order not found", {
      extensions: {
        code: "NOT_FOUND",
        http: { status: 404 },
        entity: "order",
      },
    });
  }

  payment.status = paymentIntent.status as StripePaymentStatusType;

  let status: OrderStatusType;

  if (
    paymentIntent.status === "requires_payment_method" &&
    paymentIntent.last_payment_error
  ) {
    status = OrderStatusType.failed;
  } else {
    switch (paymentIntent.status) {
      case "succeeded":
        status = OrderStatusType.completed;
        break;
      case "canceled":
        status = OrderStatusType.cancelled;
        break;
      default:
        status = OrderStatusType.pending;
    }
  }

  order.status = status;
  await dataSource.manager.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(order);
    await transactionalEntityManager.save(payment);
  });

  return payment;
};
